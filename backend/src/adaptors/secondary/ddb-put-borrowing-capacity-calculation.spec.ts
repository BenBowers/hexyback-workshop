import { InternalError } from '@/errors/InternalError';
import { PutBorrowingCapacityCalculationInput } from '@/ports/secondary/DynamoDBPutBorrowingCapacityCalculation';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { putBorrowingCapacityCalculation } from './ddb-put-borrowing-capacity-calculation';

describe('ddb-put-borrowing-capacity-calculation', () => {
  const borrowingCapacityCalculation: PutBorrowingCapacityCalculationInput = {
    estimatedBorrowingCapacity: 300_000,
    timestamp: '2024-03-15T00:00:00.000Z',
    borrowerEmail: 'john.doe@example.com',
    borrowingCapacityCalculationId: 'd5fe6ff5-20b3-4581-b38f-9b034c20d783',
    employmentStatus: 'FULL_TIME',
    grossAnnualIncome: 60_000,
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
    dynamoDbMock.rejects(new Error('Cheers Kent'));
    await expect(
      putBorrowingCapacityCalculation(borrowingCapacityCalculation)
    ).rejects.toBeInstanceOf(InternalError);
  });
  it(
    'calls the dynamo db client with a put item command, passing it the financial data table name ' +
      'and a marshalled borrowing capacity calculation containing a partition key of the borrowers email ' +
      'and a sort key of the borrowing capacity calculation id and timestamp',
    async () => {
      await putBorrowingCapacityCalculation(borrowingCapacityCalculation);
      expect(dynamoDbMock).toHaveReceivedCommandWith(PutItemCommand, {
        TableName: 'financial-data-table',
        Item: {
          pk: { S: 'john.doe@example.com' },
          sk: {
            S:
              `BORROWING_CAPACITY_CALCULATION#${borrowingCapacityCalculation.borrowingCapacityCalculationId}` +
              `#TIMESTAMP#${borrowingCapacityCalculation.timestamp}`,
          },
          estimatedBorrowingCapacity: { N: '300000' },
          grossAnnualIncome: { N: '60000' },
          employmentStatus: { S: 'FULL_TIME' },
          borrowingCapacityCalculationId: {
            S: borrowingCapacityCalculation.borrowingCapacityCalculationId,
          },
          timestamp: { S: borrowingCapacityCalculation.timestamp },
        },
      });
    }
  );
});
