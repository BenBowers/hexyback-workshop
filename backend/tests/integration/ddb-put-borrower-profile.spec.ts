import { putBorrowerProfile } from '@/adaptors/secondary/ddb-put-borrower-profile';
import { BorrowerProfile } from '@/types/api';
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';
import { Config } from 'sst/node/config';
import { afterEach, describe, expect, it } from 'vitest';

describe('ddb-put-borrower-profile', () => {
  const financialDataTableName = Config.FINANCIAL_DATA_TABLE_NAME;
  const client = new DynamoDBClient({});
  const getBorrowerProfile = (email: string) =>
    client
      .send(
        new GetItemCommand({
          TableName: financialDataTableName,
          Key: marshall({ pk: email, sk: 'BORROWER' }),
        })
      )
      .then(({ Item }) => (Item ? unmarshall(Item) : undefined));
  const deleteBorrowerProfile = (email: string) =>
    client.send(
      new DeleteItemCommand({
        TableName: financialDataTableName,
        Key: marshall({ pk: email, sk: 'BORROWER' }),
      })
    );
  const borrowerProfile: BorrowerProfile = {
    dob: '1981-11-02',
    creditScore: 500,
    email: `me+${randomUUID()}@you.com`,
    name: 'Jill Jerkson',
  };
  afterEach(async () => {
    await deleteBorrowerProfile(borrowerProfile.email);
  });
  it(
    'writes a borrower profile record with PK of email and SK of BORROWER ' +
      'given a valid borrower profile entity',
    async () => {
      await putBorrowerProfile(borrowerProfile);
      await expect(
        getBorrowerProfile(borrowerProfile.email)
      ).resolves.toMatchObject({
        pk: borrowerProfile.email,
        sk: 'BORROWER',
        dob: borrowerProfile.dob,
        email: borrowerProfile.email,
        creditScore: borrowerProfile.creditScore,
      });
    }
  );
});
