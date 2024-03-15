import {
  DeleteItemCommand,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Config } from 'sst/node/config';
const financialDataTableName = Config.FINANCIAL_DATA_TABLE_NAME;
const client = new DynamoDBClient({});
export const getBorrowingCapacityCalculation = (
  email: string,
  borrowingCapacityCalculationId: string
) =>
  client
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
            AttributeValueList: [
              {
                S: `BORROWING_CAPACITY_CALCULATION#${borrowingCapacityCalculationId}`,
              },
            ],
          },
        },
      })
    )
    .then(({ Items }) => (Items?.length ? unmarshall(Items[0]!) : undefined));

export const deleteBorrowingCapacityCalculation = (
  email: string,
  borrowingCapacityCalculationId: string
) =>
  getBorrowingCapacityCalculation(email, borrowingCapacityCalculationId).then(
    async (borrowingCapacityCalculation) => {
      if (borrowingCapacityCalculation) {
        await client.send(
          new DeleteItemCommand({
            TableName: financialDataTableName,
            Key: marshall({
              pk: email,
              sk:
                `BORROWING_CAPACITY_CALCULATION#${borrowingCapacityCalculationId}` +
                `#TIMESTAMP#${borrowingCapacityCalculation.timestamp}`,
            }),
          })
        );
      }
    }
  );
