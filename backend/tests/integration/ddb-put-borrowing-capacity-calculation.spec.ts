import {
  PutBorrowingCapacityCalculationInput,
  putBorrowingCapacityCalculation,
} from '@/adaptors/secondary/ddb-put-borrowing-capacity-calculation';
import {
  DeleteItemCommand,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';
import { Config } from 'sst/node/config';
import { afterAll, describe, expect, it } from 'vitest';
describe('ddb-put-borrowing-capacity-calculation', () => {
  const financialDataTableName = Config.FINANCIAL_DATA_TABLE_NAME;
  const client = new DynamoDBClient({});
  const getBorrowingCapacityCalculation = (
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
  const deleteBorrowingCapacityCalculation = (
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
  const borrowingCapacityCalculation: PutBorrowingCapacityCalculationInput = {
    borrowingCapacityCalculationId: randomUUID(),
    borrowerEmail: `me+${randomUUID()}@you.com`,
    estimatedBorrowingCapacity: 100000,
    employmentStatus: 'FULL_TIME',
    grossAnnualIncome: 100000,
    timestamp: new Date().toISOString(),
  };
  afterAll(async () => {
    await deleteBorrowingCapacityCalculation(
      borrowingCapacityCalculation.borrowerEmail,
      borrowingCapacityCalculation.borrowingCapacityCalculationId
    );
  });
  it(
    'writes a borrowing capacity calculation record with ' +
      'PK of email and SK of BORROWING_CAPACITY_CALCULATION#<id> ' +
      'given a valid borrowing capacity calculation entity',
    async () => {
      await putBorrowingCapacityCalculation(borrowingCapacityCalculation);
      await expect(
        getBorrowingCapacityCalculation(
          borrowingCapacityCalculation.borrowerEmail,
          borrowingCapacityCalculation.borrowingCapacityCalculationId
        )
      ).resolves.toMatchObject({
        pk: borrowingCapacityCalculation.borrowerEmail,
        sk:
          `BORROWING_CAPACITY_CALCULATION#${borrowingCapacityCalculation.borrowingCapacityCalculationId}` +
          `#TIMESTAMP#${borrowingCapacityCalculation.timestamp}`,
        borrowingCapacityCalculationId:
          borrowingCapacityCalculation.borrowingCapacityCalculationId,
        estimatedBorrowingCapacity:
          borrowingCapacityCalculation.estimatedBorrowingCapacity,
        grossAnnualIncome: borrowingCapacityCalculation.grossAnnualIncome,
        employmentStatus: borrowingCapacityCalculation.employmentStatus,
        timestamp: borrowingCapacityCalculation.timestamp,
      });
    }
  );
});
