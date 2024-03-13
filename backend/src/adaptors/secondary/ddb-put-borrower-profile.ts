import { InternalError } from '@/errors/InternalError';
import { PutBorrowerProfilePort } from '@/ports/secondary/DynamoDBPutBorrowerProfile';
import { BorrowerProfile } from '@/types/api';
import { Log, getTracer } from '@/utils/telemetry';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Config } from 'sst/node/config';

const dynamoDbClient = getTracer().captureAWSv3Client(new DynamoDBClient({}));
const financialDataTableName = Config.FINANCIAL_DATA_TABLE_NAME;

export const putBorrowerProfile: PutBorrowerProfilePort = async (
  borrowerProfile: BorrowerProfile
): Promise<void> => {
  const borrowerProfileDto = {
    ...borrowerProfile,
    pk: borrowerProfile.email,
    sk: 'BORROWER',
  };
  try {
    Log.info(`Putting borrower profile ${borrowerProfile.email}`);
    await dynamoDbClient.send(
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
