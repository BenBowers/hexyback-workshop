import { BorrowerProfile } from '@/types/api';
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Config } from 'sst/node/config';

const financialDataTableName = Config.FINANCIAL_DATA_TABLE_NAME;
const client = new DynamoDBClient({});

export const deleteBorrowerProfile = (email: string) =>
  client.send(
    new DeleteItemCommand({
      TableName: financialDataTableName,
      Key: marshall({ pk: email, sk: 'BORROWER' }),
    })
  );
export const putBorrowerProfile = async (borrowerProfile: BorrowerProfile) => {
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

export const getBorrowerProfile = (email: string) =>
  client
    .send(
      new GetItemCommand({
        TableName: financialDataTableName,
        Key: marshall({ pk: email, sk: 'BORROWER' }),
      })
    )
    .then(({ Item }) => (Item ? unmarshall(Item) : undefined));
