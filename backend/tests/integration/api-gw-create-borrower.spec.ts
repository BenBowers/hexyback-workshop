import { BorrowerProfile } from '@/types/api';
import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { paths } from '@openapi';
import { randomUUID } from 'crypto';
import openApiFetch from 'openapi-fetch';
import { Config } from 'sst/node/config';
import { describe, it } from 'vitest';

const baseUrl = Config.API_ENDPOINT;
const dynamodbClient = new DynamoDBClient({});
const deleteBorrowerProfile = (email: string) =>
  dynamodbClient.send(
    new DeleteItemCommand({
      TableName: Config.FINANCIAL_DATA_TABLE_NAME,
      Key: marshall({ pk: email, sk: 'BORROWER' }),
    })
  );
describe.concurrent('api-aw-create-borrower', () => {
  const apiClient = openApiFetch<paths>({
    baseUrl: baseUrl,
  });

  it('responds with a 400 Bad Request given the user does not provide a valid borrower profile', async ({
    expect,
  }) => {
    await expect(
      apiClient.POST('/borrower', {
        body: {
          email: '',
        } as unknown as BorrowerProfile,
      })
    ).resolves.toEqual({
      error: {
        message: 'Invalid request body',
      },
      response: expect.objectContaining({
        status: 400,
        statusText: 'Bad Request',
      }),
    });
  });
  it('responds with a 400 Bad Request given the user provides a credit score out of the valid range (0-1000)', async ({
    expect,
  }) => {
    await expect(
      apiClient.POST('/borrower', {
        body: {
          email: 'john.doe@example.com',
          creditScore: 1001,
          dob: '1990-01-01',
          name: 'John Doe',
        },
      })
    ).resolves.toEqual({
      error: {
        message: 'Invalid request body',
      },
      response: expect.objectContaining({
        status: 400,
        statusText: 'Bad Request',
      }),
    });
  });
  it('responds with a 400 Bad Request given the user provides a date of birth that is not in ISO8601 date string', async ({
    expect,
  }) => {
    await expect(
      apiClient.POST('/borrower', {
        body: {
          email: 'john.doe@example.com',
          creditScore: 500,
          dob: 'not-a-date',
          name: 'John Doe',
        },
      })
    ).resolves.toEqual({
      error: {
        message: 'Invalid request body',
      },
      response: expect.objectContaining({
        status: 400,
        statusText: 'Bad Request',
      }),
    });
  });
  it('responds with a 201 given the user provides a valid borrower profile and the borrower does not currently exist', async ({
    expect,
  }) => {
    const email = `john.doe+${randomUUID()}@example.com`;
    await expect(
      apiClient.POST('/borrower', {
        body: {
          email,
          creditScore: 500,
          dob: '1990-01-01',
          name: 'John Doe',
        },
      })
    ).resolves.toEqual({
      data: {
        email,
      },
      response: expect.objectContaining({
        status: 201,
      }),
    });

    await deleteBorrowerProfile(email);
  });
  it('responds with a 200 given the user provides a valid borrower profile and the borrower already exists', async ({
    expect,
  }) => {
    const borrowerProfile: BorrowerProfile = {
      email: `john.doe+${randomUUID()}@example.com`,
      creditScore: 500,
      dob: '1990-01-01',
      name: 'John Doe',
    };
    await apiClient.POST('/borrower', {
      body: borrowerProfile,
    });
    expect(
      apiClient.POST('/borrower', { body: borrowerProfile })
    ).resolves.toEqual({
      data: {
        email: borrowerProfile.email,
      },
      response: expect.objectContaining({ status: 200 }),
    });

    await deleteBorrowerProfile(borrowerProfile.email);
  });
});
