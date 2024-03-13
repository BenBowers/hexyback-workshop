export type GenerateApiDependencies = {
  calculateBorrowingCapacityHandlerArn: string;
  applyForLoanHandlerArn: string;
  createBorrowerProfileHandlerArn: string;
};
export const generateApiSpec = ({
  calculateBorrowingCapacityHandlerArn,
  applyForLoanHandlerArn,
  createBorrowerProfileHandlerArn,
}: GenerateApiDependencies) => ({
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
          'borrowerEmail',
          'employmentStatus',
          'grossAnnualIncome',
          'monthlyExpenses',
        ],
        properties: {
          borrowerEmail: {
            type: 'string',
          },
          employmentStatus: {
            $ref: '#/components/schemas/EmploymentStatus',
          },
          grossAnnualIncome: {
            type: 'integer',
          },
          monthlyExpenses: {
            type: 'integer',
          },
        },
      },
      Borrower: {
        type: 'object',
        required: ['name', 'dob', 'email', 'creditScore'],
        properties: {
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          dob: {
            type: 'string',
            description:
              'Borrowers date of birth in ISO8601 date string format',
            example: '1990-01-01',
            pattern: '^(\\d{4}-\\d{2}-\\d{2})$',
          },
          creditScore: {
            type: 'integer',
            minimum: 0,
            maximum: 1000,
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
    '/borrower': {
      post: {
        summary: 'Create a borrower',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Borrower',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Borrower already exists',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '201': {
            description: 'Borrower created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
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
          uri: `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${createBorrowerProfileHandlerArn}/invocations`,
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
    '/borrowingCapacity': {
      get: {
        summary: 'Get an estimate of your borrowing capacity',
        parameters: [
          {
            name: 'borrowerEmail',
            description: 'Email address of the borrower',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'grossAnnualIncome',
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
          '400': {
            description: 'Bad Request',
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
          uri: `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${calculateBorrowingCapacityHandlerArn}/invocations`,
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
          '201': {
            description: 'Loan application created',
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
          '400': {
            description: 'Bad Request',
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
