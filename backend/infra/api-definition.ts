export const generateApiSpec = (
  calculateBorrowingPowerHandlerArn: string,
  applyForLoanHandlerArn: string
) => ({
  openapi: '3.0.1',
  info: {
    title: 'loan-api',
    version: 'v1.0',
  },
  components: {
    schemas: {
      EmploymentStatus: {
        type: 'string',
        enum: ['CASUAL', 'FULL_TIME', 'PART_TIME', 'SELF_EMPLOYED'],
      },
      LoanApplicationStatus: {
        type: 'string',
        enum: ['APPROVED', 'REJECTED', 'REVIEW'],
      },
      LoanApplication: {
        type: 'object',
        required: [
          'age',
          'grossIncome',
          'employmentStatus',
          'grossIncome',
          'creditScore',
          'monthlyExpenses',
        ],
        properties: {
          grossIncome: {
            type: 'integer',
          },
          monthlyExpenses: {
            type: 'integer',
          },
          creditScore: {
            type: 'integer',
          },
          age: {
            type: 'integer',
          },
          employmentStatus: {
            $ref: '#/components/schemas/EmploymentStatus',
          },
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
    '/borrowingCapacity': {
      get: {
        summary: 'Get an estimate of your borrowing power',
        parameters: [
          {
            name: 'age',
            description: 'Age of the borrower',
            in: 'query',
            required: true,
            schema: {
              type: 'integer',
            },
          },
          {
            name: 'grossIncome',
            description: 'Gross annual income of the borrower',
            in: 'query',
            required: true,
            schema: {
              type: 'integer',
            },
          },
          {
            name: 'employmentStatus',
            description: 'Current employment status of the borrower',
            in: 'query',
            required: true,
            schema: {
              $ref: '#/components/schemas/EmploymentStatus',
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
                  type: 'object',
                  required: ['estimatedBorrowingCapacity'],
                  properties: {
                    estimatedBorrowingCapacity: {
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
          uri: `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${calculateBorrowingPowerHandlerArn}/invocations`,
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
    '/loan': {
      post: {
        summary: 'Apply for a loan',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoanApplication',
              },
            },
          },
        },
        description: 'Assesses a borrowers loan application',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['loanApplicationStatus'],
                  properties: {
                    loanApplicationStatus: {
                      schema: {
                        $ref: '#/components/schemas/LoanApplicationStatus',
                      },
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
          uri: `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${applyForLoanHandlerArn}/invocations`,
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
