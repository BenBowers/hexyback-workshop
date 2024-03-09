import {
  aws_apigateway as apigateway,
  aws_iam as iam,
  aws_logs as logs,
} from 'aws-cdk-lib';
import { Config, Function, StackContext } from 'sst/constructs';
import { generateApiSpec } from './api-definition';

export function ConfigStack({ stack, app }: StackContext) {
  const calculateBorrowingPowerHandler = new Function(
    stack,
    'calculateBorrowingPowerLambda',
    {
      handler: 'src/adaptors/primary/api-gw-calculate-borrowing-power.handler',
      functionName: app.logicalPrefixedName('CalculateBorrowingPower'),
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
      generateApiSpec(calculateBorrowingPowerHandler.functionArn, '')
    ),
  });
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
  Config.Parameter.create(stack, {
    API_ENDPOINT: api.url,
  });
  stack.addOutputs({});
}
