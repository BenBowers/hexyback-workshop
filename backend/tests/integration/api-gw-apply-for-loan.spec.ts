import { ApplyForLoanRequestBody } from '@/types/api';
import {
  DeleteItemCommand,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { paths } from '@openapi';
import { randomUUID } from 'crypto';
import openApiFetch from 'openapi-fetch';
import { Config } from 'sst/node/config';
import { describe, it } from 'vitest';
const baseUrl = Config.API_ENDPOINT;

const dynamodbClient = new DynamoDBClient({});
const financialDataTableName = Config.FINANCIAL_DATA_TABLE_NAME;
const deleteBorrowerProfile = (email: string) =>
  dynamodbClient.send(
    new DeleteItemCommand({
      TableName: financialDataTableName,
      Key: marshall({ pk: email, sk: 'BORROWER' }),
    })
  );

const getLoanApplications = (email: string) =>
  dynamodbClient
    .send(
      new QueryCommand({
        TableName: financialDataTableName,
        KeyConditions: {
          pk: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [{ S: email }],
          },
          sk: {
            ComparisonOperator: 'BEGINS_WITH',
            AttributeValueList: [{ S: 'LOAN_APPLICATION#' }],
          },
        },
      })
    )
    .then(({ Items }) =>
      Items?.length ? Items.map((item) => unmarshall(item)) : undefined
    );
const deleteLoanApplications = (email: string) =>
  getLoanApplications(email).then(async (loanApplications) => {
    if (loanApplications) {
      await Promise.all(
        loanApplications.map(async (borrowingCapacityCalculation) => {
          await dynamodbClient.send(
            new DeleteItemCommand({
              TableName: financialDataTableName,
              Key: marshall({
                pk: email,
                sk:
                  `LOAN_APPLICATION#${borrowingCapacityCalculation.borrowingCapacityCalculationId}` +
                  `#TIMESTAMP#${borrowingCapacityCalculation.timestamp}`,
              }),
            })
          );
        })
      );
    }
  });

describe.concurrent('api-aw-apply-for-loan', () => {
  const apiClient = openApiFetch<paths>({
    baseUrl: baseUrl,
  });
  it.todo(
    'responds with a 400 Bad Request given the user does not provide the required request body',
    async ({ expect }) => {
      await expect(
        apiClient.POST('/loan', {
          body: {} as unknown as ApplyForLoanRequestBody,
        })
      ).resolves.toEqual({
        error: {
          message: 'Invalid request body',
        },
<<<<<<< HEAD
      })
    ).resolves.toEqual({
      error: {
        message: 'Borrower with the provided email does not exist',
      },
      response: expect.objectContaining({
        status: 400,
        statusText: 'Bad Request',
      }),
    });

    await Promise.all([
      deleteBorrowerProfile(borrowerEmail),
      deleteLoanApplications(borrowerEmail),
    ]);
  });
  it('responds with a 201 Submitted with the loan application status given the user provides the required request body when the borrower profile exists', async ({
    expect,
  }) => {
    const borrowerEmail = `loan-application+${randomUUID()}@example.com`;
    await apiClient.POST('/borrower', {
      body: {
        email: borrowerEmail,
        name: 'John Doe',
        creditScore: 800,
        dob: '1999-01-01',
      },
    });
    await expect(
      apiClient.POST('/loan', {
        body: {
          borrowerEmail: borrowerEmail,
          grossAnnualIncome: 100_000,
          employmentStatus: 'FULL_TIME',
          monthlyExpenses: 1000,
        },
      })
    ).resolves.toEqual({
      data: {
        loanApplicationStatus: 'APPROVED',
      },
      response: expect.objectContaining({
        status: 201,
        statusText: 'Created',
      }),
    });

    await Promise.all([
      deleteBorrowerProfile(borrowerEmail),
      deleteLoanApplications(borrowerEmail),
    ]);
  });
});
=======
        response: expect.objectContaining({
          status: 400,
          statusText: 'Bad Request',
        }),
      });
    }
  );
  it.todo(
    'response with a 400 Bad Request given the user provides the required request body but the borrower profile does not exist',
    async ({ expect }) => {}
  );
  it.todo(
    'responds with a 201 Submitted with the loan application status given the user provides the required request body when the borrower profile exists',
    async ({ expect }) => {}
  );
});
>>>>>>> b68768227ce2f955339505e0860db375d7e59eb0
