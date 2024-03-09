export const generateApiSpec = (
  apiGatewayAuthHandlerArn: string,
  getCreditScoreHandlerArn: string
) => ({
  openapi: '3.0.1',
  info: {
    title: 'credit-score-service-api',
    version: 'v1.0',
  },
  components: {
    schemas: {},
    securitySchemes: {
      EndpointAuthorizer: {
        type: 'apiKey',
        name: 'authorization',
        in: 'header',
        'x-amazon-apigateway-authtype': 'custom',
        'x-amazon-apigateway-authorizer': {
          type: 'token',
          identitySource: 'method.request.header.authorization',
          authorizerUri: `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${apiGatewayAuthHandlerArn}/invocations`,
        },
      },
    },
  },
  'x-amazon-apigateway-request-validators': {
    all: {
      validateRequestBody: true,
      validateRequestParameters: true,
    },
  },
  'x-amazon-apigateway-request-validator': 'all',
  paths: {
    '/creditScore': {
      get: {
        summary: 'Get the credit score of a individual',
        security: [
          {
            EndpointAuthorizer: [],
          },
        ],
        parameters: [
          {
            name: 'driversLicenseNumber',
            description: 'Drivers License Number',
            in: 'query',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
        description:
          'Gets the credit score of an individual identified by their drivers license number',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['creditScore'],
                  properties: {
                    creditScore: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
        'x-amazon-apigateway-integration': {
          uri: `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${getCreditScoreHandlerArn}/invocations`,
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
});
