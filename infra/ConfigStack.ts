import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Config, Function, StackContext } from 'sst/constructs';
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
    apiDefinition: apigateway.ApiDefinition.fromInline({
      openapi: '3.0.1',
      info: {
        title: 'loan-api',
        version: 'v1.0',
      },
      components: {
        securitySchemes: {
          EndpointAuthorizer: {
            type: 'apiKey',
            name: 'authorization',
            in: 'header',
            'x-amazon-apigateway-authtype': 'custom',
            'x-amazon-apigateway-authorizer': {
              type: 'token',
              identitySource: 'method.request.header.authorization',
              authorizerUri: `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${apiGatewayAuthHandler.functionArn}/invocations`,
            },
          },
        },
      },
      paths: {
        '/borrowingCapacity': {
          get: {
            summary: 'Get an estimate of your borrowing power',
            security: [
              {
                EndpointAuthorizer: [],
              },
            ],
            parameters: [
              {
                name: 'mealId',
                description: 'A unique identifier for a meal',
                in: 'query',
                required: true,
                schema: {
                  type: 'string',
                },
              },
            ],
            description: 'Calculates borrowing capacity based on input',
            responses: {
              '200': {
                description: 'OK',
                content: {
                  'application/json': {
                    schema: {
                      type: 'string',
                    },
                  },
                },
              },
              '500': {
                description: 'Internal Server Error',
                content: {},
              },
            },
            'x-amazon-apigateway-integration': {
              uri: `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${calculateBorrowingPowerHandler.functionArn}/invocations`,
              responses: {
                default: {
                  statusCode: '200',
                },
              },
              passthroughBehavior: 'when_no_match',
              httpMethod: 'POST',
              contentHandling: 'CONVERT_TO_TEXT',
              type: 'aws_proxy',
            },
          },
        },
      },
    }),
  });

  Config.Parameter.create(stack, {
    API_ENDPOINT: api.url,
  });
  stack.addOutputs({});
}
