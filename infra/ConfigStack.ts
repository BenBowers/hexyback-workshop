import { aws_apigateway as apigateway, aws_iam as iam } from 'aws-cdk-lib';
import { Config, Function, StackContext } from 'sst/constructs';
import { generateApiSpec } from './api-definition';
export function ConfigStack({ stack, app }: StackContext) {
  const apiKey = new Config.Secret(stack, 'API_KEY');
  const apiGatewayAuthHandler = new Function(stack, 'lambdaAuth', {
    functionName: app.logicalPrefixedName('apiAuthorizer'),
    handler: 'src/adaptors/primary/api-gw-authorizer.handler',
    bind: [apiKey],
  });
  const calculateBorrowingPowerHandler = new Function(
    stack,
    'calculateBorrowingPowerLambda',
    {
      handler: 'src/adaptors/primary/api-gw-calculate-borrowing-power.handler',
      functionName: app.logicalPrefixedName('CalculateBorrowingPower'),
    }
  );
  const api = new apigateway.SpecRestApi(stack, 'loanApiGateway', {
    endpointTypes: [apigateway.EndpointType.REGIONAL],
    apiDefinition: apigateway.ApiDefinition.fromInline(
      generateApiSpec(
        apiGatewayAuthHandler.functionArn,
        calculateBorrowingPowerHandler.functionArn
      )
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
  apiGatewayAuthHandler.grantInvoke(
    new iam.ServicePrincipal('apigateway.amazonaws.com', {
      conditions: {
        ArnLike: {
          'aws:SourceArn': `arn:aws:execute-api:${app.region}:${app.account}:${api.restApiId}/authorizers/*`,
        },
      },
    })
  );
  Config.Parameter.create(stack, {
    API_ENDPOINT: api.url,
  });
  stack.addOutputs({});
}
