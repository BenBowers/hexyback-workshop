import {
  aws_apigateway as apigateway,
  aws_iam as iam,
  aws_logs as logs,
} from 'aws-cdk-lib';
import { Config, Function, StackContext, Table } from 'sst/constructs';
import { generateApiSpec } from './api-definition';

export function ConfigStack({ stack, app }: StackContext) {
  const financialDataTable = new Table(stack, 'FinancialData', {
    fields: {
      pk: 'string',
      sk: 'string',
      email: 'string',
      dob: 'string',
      creditScore: 'number',
      monthlyExpenses: 'number',
      grossAnnualIncome: 'number',
      employmentStatus: 'string',
      borrowingCapacity: 'number',
      loanApplicationStatus: 'string',
      entity: 'string',
    },
    primaryIndex: {
      partitionKey: 'pk',
      sortKey: 'sk',
    },
  });
  const { FINANCIAL_DATA_TABLE_NAME } = Config.Parameter.create(stack, {
    FINANCIAL_DATA_TABLE_NAME: financialDataTable.tableName,
  });

  const calculateBorrowingPowerHandler = new Function(
    stack,
    'calculateBorrowingPowerLambda',
    {
      handler: 'src/adaptors/primary/api-gw-calculate-borrowing-power.handler',
      functionName: app.logicalPrefixedName('CalculateBorrowingPower'),
    }
  );
  const applyForLoanHandler = new Function(stack, 'applyForLoanHandlerLambda', {
    handler: 'src/adaptors/primary/api-gw-apply-for-loan.handler',
    functionName: app.logicalPrefixedName('ApplyForLoan'),
  });

  const createBorrowerProfileHandler = new Function(
    stack,
    'createBorrowerProfileHandlerLambda',
    {
      handler: 'src/adaptors/primary/api-gw-create-borrower-profile.handler',
      functionName: app.logicalPrefixedName('CreateBorrowerProfile'),
      bind: [FINANCIAL_DATA_TABLE_NAME],
      permissions: [[financialDataTable.cdk.table, 'grantReadWriteData']],
    }
  );

  const apiGatewayCloudwatchLogGroup = new logs.LogGroup(
    stack,
    'apiGatewayCloudwatchLogGroup',
    {
      logGroupName: `/aws/apigw/${app.stage}-loans`,
    }
  );
  const api = new apigateway.SpecRestApi(stack, 'loanApiGateway', {
    endpointTypes: [apigateway.EndpointType.REGIONAL],
    deployOptions: {
      description:
        'Gateway for processing all loan/borrowing calculations and applications',
      accessLogDestination: new apigateway.LogGroupLogDestination(
        apiGatewayCloudwatchLogGroup
      ),
      loggingLevel: apigateway.MethodLoggingLevel.INFO,
      tracingEnabled: true,
      metricsEnabled: true,
      // Warning: disable for production apis with PII
      dataTraceEnabled: true,
    },
    apiDefinition: apigateway.ApiDefinition.fromInline(
      generateApiSpec({
        calculateBorrowingPowerHandlerArn:
          calculateBorrowingPowerHandler.functionArn,
        applyForLoanHandlerArn: applyForLoanHandler.functionArn,
        createBorrowerProfileHandlerArn:
          createBorrowerProfileHandler.functionArn,
      })
    ),
  });
  createBorrowerProfileHandler.grantInvoke(
    new iam.ServicePrincipal('apigateway.amazonaws.com', {
      conditions: {
        ArnLike: {
          'aws:SourceArn': api.arnForExecuteApi(
            'POST',
            '/borrower',
            api.deploymentStage.stageName
          ),
        },
      },
    })
  );
  calculateBorrowingPowerHandler.grantInvoke(
    new iam.ServicePrincipal('apigateway.amazonaws.com', {
      conditions: {
        ArnLike: {
          'aws:SourceArn': api.arnForExecuteApi(
            'GET',
            '/borrowingCapacity',
            api.deploymentStage.stageName
          ),
        },
      },
    })
  );
  applyForLoanHandler.grantInvoke(
    new iam.ServicePrincipal('apigateway.amazonaws.com', {
      conditions: {
        ArnLike: {
          'aws:SourceArn': api.arnForExecuteApi(
            'POST',
            '/loan',
            api.deploymentStage.stageName
          ),
        },
      },
    })
  );
  Config.Parameter.create(stack, {
    API_ENDPOINT: api.url,
  });
  stack.addOutputs({});
}
