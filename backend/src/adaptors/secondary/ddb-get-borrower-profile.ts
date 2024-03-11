import { BorrowerProfile } from '@/entities/BorrowerProfile';
import { InternalError } from '@/errors/InternalError';
import { GetBorrowerProfilePort } from '@/ports/secondary/DynamoBDGetBorrowerProfile';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Config } from 'sst/node/config';

const client = new DynamoDBClient({});
const financialDataTableName = Config.FINANCIAL_DATA_TABLE_NAME;

export const getBorrowerProfile: GetBorrowerProfilePort = async (
  borrowerEmail: string
): Promise<BorrowerProfile | undefined> => {
  try {
    const getItemResult = await client.send(
      new GetItemCommand({
        TableName: financialDataTableName,
        Key: marshall({ pk: borrowerEmail, sk: 'BORROWER' }),
        ProjectionExpression: 'email, age, dob, creditScore',
      })
    );
    return getItemResult.Item
      ? (unmarshall(getItemResult.Item) as BorrowerProfile)
      : undefined;
  } catch (error) {
    throw new InternalError(
      'Failed to get borrower profile from financial data table'
    );
  }
};
