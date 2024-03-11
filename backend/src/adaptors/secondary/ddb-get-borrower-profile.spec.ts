import { BorrowerProfile } from '@/entities/BorrowerProfile';
import { InternalError } from '@/errors/InternalError';
import {
  DynamoDBClient,
  GetItemCommand,
  InternalServerError,
} from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { Config } from 'sst/node/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBorrowerProfile } from './ddb-get-borrower-profile';

describe('dbb-get-borrower-profile', () => {
  const borrowerProfile: BorrowerProfile = {
    dob: '1981-11-02',
    creditScore: 500,
    email: 'me@you.com',
    name: 'Jill Jerkson',
  };
  vi.mock('sst/node/config', () => ({
    Config: {
      FINANCIAL_DATA_TABLE_NAME: 'financial-data-table',
    },
  }));
  const dynamoDbMock = mockClient(DynamoDBClient);
  beforeEach(() => {
    dynamoDbMock.reset();
  });
  it('throws an InternalError when the dynamodb client rejects for any reason', async () => {
    dynamoDbMock.rejects(
      new InternalServerError({ $metadata: {}, message: 'Cheers Kent' })
    );
    await expect(
      getBorrowerProfile(borrowerProfile.email)
    ).rejects.toBeInstanceOf(InternalError);
  });
  it(
    'calls the dynamodb client with a get item command, passing it the financial data table name ' +
      'and a marshalled object containing a partition key and a sort key and a projection expression',
    async () => {
      dynamoDbMock.on(GetItemCommand).resolves({
        Item: {
          creditScore: {
            N: '500',
          },
          dob: {
            S: '1981-11-02',
          },
          email: {
            S: 'me@you.com',
          },
          name: {
            S: 'Jill Jerkson',
          },
        },
      });
      await getBorrowerProfile(borrowerProfile.email);

      expect(dynamoDbMock).toHaveReceivedCommandWith(GetItemCommand, {
        TableName: Config.FINANCIAL_DATA_TABLE_NAME,
        Key: {
          pk: {
            S: 'me@you.com',
          },
          sk: {
            S: 'BORROWER',
          },
        },
      });
    }
  );
  it('resolves with a BorrowerProfile when the dynamodb client resolves with an item', async () => {
    dynamoDbMock.on(GetItemCommand).resolves({
      Item: {
        creditScore: {
          N: '500',
        },
        dob: {
          S: '1981-11-02',
        },
        email: {
          S: 'me@you.com',
        },
        name: {
          S: 'Jill Jerkson',
        },
      },
    });
    await expect(
      getBorrowerProfile(borrowerProfile.email)
    ).resolves.toStrictEqual({
      dob: '1981-11-02',
      creditScore: 500,
      email: 'me@you.com',
      name: 'Jill Jerkson',
    });
  });
});
