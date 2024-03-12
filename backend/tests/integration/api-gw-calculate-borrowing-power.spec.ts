import { BorrowingCapacityGetParams } from '@/types/api';
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

const getBorrowingCapacityCalculations = (email: string) =>
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
            AttributeValueList: [{ S: 'BORROWING_CAPACITY_CALCULATION#' }],
          },
        },
      })
    )
    .then(({ Items }) =>
      Items?.length ? Items.map((item) => unmarshall(item)) : undefined
    );
const deleteBorrowingCapacityCalculations = (email: string) =>
  getBorrowingCapacityCalculations(email).then(
    async (borrowingCapacityCalculations) => {
      if (borrowingCapacityCalculations) {
        await Promise.all(
          borrowingCapacityCalculations.map(
            async (borrowingCapacityCalculation) => {
              await dynamodbClient.send(
                new DeleteItemCommand({
                  TableName: financialDataTableName,
                  Key: marshall({
                    pk: email,
                    sk:
                      `BORROWING_CAPACITY_CALCULATION#${borrowingCapacityCalculation.borrowingCapacityCalculationId}` +
                      `#TIMESTAMP#${borrowingCapacityCalculation.timestamp}`,
                  }),
                })
              );
            }
          )
        );
      }
    }
  );
describe.concurrent('api-aw-calculate-borrowing-power', () => {
  const apiClient = openApiFetch<paths>({
    baseUrl: baseUrl,
  });
  it('responds with a 400 Bad Request given the borrower does not provide the required query params', async ({
    expect,
  }) => {
    {
      await expect(
        apiClient.GET('/borrowingCapacity', {
          params: {
            query: {} as BorrowingCapacityGetParams,
          },
        })
      ).resolves.toEqual({
        error: {
          message:
            'Missing required request parameters: [grossAnnualIncome, borrowerEmail, employmentStatus]',
        },
        response: expect.objectContaining({
          status: 400,
          statusText: 'Bad Request',
        }),
      });
    }
  });
  it('responds with a 400 Bad request if the borrower provides an email where no borrower exists with email', async ({
    expect,
  }) => {
    const borrowerEmail = `borrowing-capacity+${randomUUID()}@example.com`;
    await expect(
      apiClient.GET('/borrowingCapacity', {
        params: {
          query: {
            borrowerEmail: borrowerEmail,
            employmentStatus: 'CASUAL',
            grossAnnualIncome: 100_000,
          },
        },
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
      deleteBorrowingCapacityCalculations(borrowerEmail),
    ]);
  });
  it('responds with a 200 Complete given the borrower provides the required query params when the borrower exists', async ({
    expect,
  }) => {
    const borrowerEmail = `borrowing-capacity+${randomUUID()}@example.com`;
    await apiClient.POST('/borrower', {
      body: {
        email: borrowerEmail,
        name: 'John Doe',
        creditScore: 800,
        dob: '1999-01-01',
      },
    });
    await expect(
      apiClient.GET('/borrowingCapacity', {
        params: {
          query: {
            borrowerEmail: borrowerEmail,
            employmentStatus: 'CASUAL',
            grossAnnualIncome: 100_000,
          },
        },
      })
    ).resolves.toEqual({
      data: {
        estimatedBorrowingCapacity: 24_000,
      },
      response: expect.objectContaining({
        status: 200,
        statusText: 'OK',
      }),
    });

    await Promise.all([
      deleteBorrowerProfile(borrowerEmail),
      deleteBorrowingCapacityCalculations(borrowerEmail),
    ]);
  });
});
