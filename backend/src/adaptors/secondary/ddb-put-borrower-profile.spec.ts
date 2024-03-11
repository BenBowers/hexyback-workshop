import { BorrowerProfile } from '@/entities/BorrowerProfile';
import { InternalError } from '@/errors/InternalError';
import {
  DynamoDBClient,
  InternalServerError,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { Config } from 'sst/node/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { putBorrowerProfile } from './ddb-put-borrower-profile';

describe('dbb-put-borrower-profile', () => {
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
    await expect(putBorrowerProfile(borrowerProfile)).rejects.toBeInstanceOf(
      InternalError
    );
  });
  it(
    'calls the dynamodb client with a put item command, passing it the financial data table name' +
      'and a marshalled borrower profile containing a partition key and a sort key',
    async () => {
      await putBorrowerProfile(borrowerProfile);

      expect(dynamoDbMock).toHaveReceivedCommandWith(PutItemCommand, {
        TableName: Config.FINANCIAL_DATA_TABLE_NAME,
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
});
