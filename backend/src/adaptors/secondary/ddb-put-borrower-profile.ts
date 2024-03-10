import { InternalError } from '@/errors/InternalError';
import { BorrowerProfile } from '@/types/api';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Config } from 'sst/node/config';

const client = new DynamoDBClient({});
const financialDataTableName = Config.FINANCIAL_DATA_TABLE_NAME;

export const putBorrowerProfile = async (
  borrowerProfile: BorrowerProfile
): Promise<void> => {
  const borrowerProfileDto = {
    ...borrowerProfile,
    pk: borrowerProfile.email,
    sk: 'BORROWER',
  };
  try {
    await client.send(
      new PutItemCommand({
        TableName: financialDataTableName,
        Item: marshall(borrowerProfileDto),
      })
    );
  } catch (error) {
    throw new InternalError(
      'Failed to put borrower profile to financial data table'
    );
  }
};
