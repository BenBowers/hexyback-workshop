import { BaseBorrowingCapacity } from '@/entities/BorrowingCapacityCalculation';
import { BorrowingCapacityCalculationInput } from '@/entities/BorrowingCapacityCalculationInput';
import { describe, expect, it } from 'vitest';
import { calculateBaseBorrowingCapacity } from './calculate-base-borrowing-capacity';

describe('calculate-base-borrowing-capacity', () => {
  describe('Given a borrower profile', () => {
    it('calculates the base borrowing capacity as 30% of the gross income', () => {
      const borrowerProfile = {
        grossAnnualIncome: 1000,
        age: 18,
        employmentStatus: 'FULL_TIME',
      } as BorrowingCapacityCalculationInput;
      const borrowingPowerCalculation: BaseBorrowingCapacity =
        calculateBaseBorrowingCapacity(borrowerProfile);
      expect(borrowingPowerCalculation).toEqual({
        borrowerProfile,
        baseBorrowingCapacity: 300,
      });
    });
  });
});
