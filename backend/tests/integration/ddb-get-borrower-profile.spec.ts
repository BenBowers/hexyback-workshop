import { getBorrowerProfile } from '@/adaptors/secondary/ddb-get-borrower-profile';
import { BorrowerProfile } from '@/types/api';
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';
import { Config } from 'sst/node/config';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('ddb-get-borrower-profile', () => {
  const financialDataTableName = Config.FINANCIAL_DATA_TABLE_NAME;
  const client = new DynamoDBClient({});

  const deleteBorrowerProfile = (email: string) =>
    client.send(
      new DeleteItemCommand({
        TableName: financialDataTableName,
        Key: marshall({ pk: email, sk: 'BORROWER' }),
      })
    );
  const putBorrowerProfile = async (borrowerProfile: BorrowerProfile) => {
    const borrowerProfileDto = {
      ...borrowerProfile,
      pk: borrowerProfile.email,
      sk: 'BORROWER',
    };
    await client.send(
      new PutItemCommand({
        TableName: financialDataTableName,
        Item: marshall(borrowerProfileDto),
      })
    );
  };
  const borrowerProfile: BorrowerProfile = {
    dob: '1981-11-02',
    creditScore: 500,
    email: `me+${randomUUID()}@you.com`,
    name: 'Jill Jerkson',
  };
  beforeEach(async () => {
    await putBorrowerProfile(borrowerProfile);
  });
  afterEach(async () => {
    await deleteBorrowerProfile(borrowerProfile.email);
  });
  it('retrieves an existing borrower profile given a valid borrower profile email', async () => {
    await putBorrowerProfile(borrowerProfile);
    await expect(
      getBorrowerProfile(borrowerProfile.email)
    ).resolves.toStrictEqual({
      dob: borrowerProfile.dob,
      email: borrowerProfile.email,
      creditScore: borrowerProfile.creditScore,
    });
  });
  it('resolves to undefined when the borrower does not exist', async () => {
    await putBorrowerProfile(borrowerProfile);
    await expect(
      getBorrowerProfile('fake@larphelp.net')
    ).resolves.toBeUndefined();
  });
});
