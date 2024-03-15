import { putBorrowingCapacityCalculation } from '@/adaptors/secondary/ddb-put-borrowing-capacity-calculation';
import { PutBorrowingCapacityCalculationInput } from '@/ports/secondary/DynamoDBPutBorrowingCapacityCalculation';
import { randomUUID } from 'crypto';
import { afterEach, describe, expect, it } from 'vitest';
import {
  deleteBorrowingCapacityCalculation,
  getBorrowingCapacityCalculation,
} from '../utils/borrowing-capacity-ddb';
describe('ddb-put-borrowing-capacity-calculation', () => {
  const borrowingCapacityCalculation: PutBorrowingCapacityCalculationInput = {
    borrowingCapacityCalculationId: randomUUID(),
    borrowerEmail: `me+${randomUUID()}@you.com`,
    estimatedBorrowingCapacity: 100000,
    employmentStatus: 'FULL_TIME',
    grossAnnualIncome: 100000,
    timestamp: new Date().toISOString(),
  };
  afterEach(async () => {
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
