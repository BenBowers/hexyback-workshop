import { InternalError } from '@/errors/InternalError';
import { PutBorrowingCapacityCalculationPort } from '@/ports/secondary/DynamoDBPutBorrowingCapacityCalculation';
import { Log, getTracer } from '@/utils/telemetry';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Config } from 'sst/node/config';

const dynamoDbClient = getTracer().captureAWSv3Client(new DynamoDBClient({}));
export const putBorrowingCapacityCalculation: PutBorrowingCapacityCalculationPort =
  async ({
    borrowingCapacityCalculationId,
    borrowerEmail,
    estimatedBorrowingCapacity,
    timestamp,
    grossAnnualIncome,
    employmentStatus,
  }) => {
    try {
      Log.info(
        `Putting borrowing capacity calculation ${borrowingCapacityCalculationId} for borrower ${borrowerEmail}`
      );
      await dynamoDbClient.send(
        new PutItemCommand({
          TableName: Config.FINANCIAL_DATA_TABLE_NAME,
          Item: marshall({
            pk: borrowerEmail,
            sk: `BORROWING_CAPACITY_CALCULATION#${borrowingCapacityCalculationId}#TIMESTAMP#${timestamp}`,
            estimatedBorrowingCapacity,
            grossAnnualIncome,
            employmentStatus,
            borrowingCapacityCalculationId,
            timestamp,
          }),
        })
      );
    } catch (e) {
      throw new InternalError(
        'Failed to put borrowing capacity calculation to financial data table'
      );
    }
  };
