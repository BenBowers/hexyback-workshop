import { describe, expect, it } from 'vitest';
import calculateBorrowingCapacity from './calculate-borrowing-capacity';
describe('borrowing-capacity', () => {
  describe('Given an age, gross annual income and employment status', () => {
    it('returns the borrowers estimated borrowing capacity', () => {
      const borrowingCapacity = calculateBorrowingCapacity({
        grossIncome: 1000,
        age: 64,
        employmentStatus: 'PART_TIME',
      });
      expect(borrowingCapacity).toEqual(243);
    });
  });
});
