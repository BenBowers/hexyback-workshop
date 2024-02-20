import { BorrowerProfile } from '@/entities/BorrowerProfile';
import { AdjustedForEmploymentStatus } from '@/entities/BorrowingPowerCalculation';
import { describe, expect, it } from 'vitest';
import adjustForAge from './adjust-for-age';

describe('adjust-for-age', () => {
  describe('Given the borrowing power adjusted for employment status', () => {
    describe('for a borrower under 25 years of age', () => {
      it('reduces the age adujusted borrowing capacity by 10%', () => {
        const borrowerProfile: BorrowerProfile = {
          grossIncome: 1000,
          age: 18,
          employmentStatus: 'FULL_TIME',
        };
        const borrowingPowerCalculation: AdjustedForEmploymentStatus = {
          borrowerProfile,
          baseBorrowingCapacity: 300,
          adjustedForEmploymentStatus: 300,
        };
        expect(adjustForAge(borrowingPowerCalculation)).toEqual({
          borrowerProfile,
          baseBorrowingCapacity: 300,
          adjustedForEmploymentStatus: 300,
          adjustedForAge: 270,
        });
      });
    });
    describe('for a borrower between the ages of 25 (inclusive) and 60 (inclusive) years of age', () => {
      it('does nothing', () => {
        const borrowerProfile: BorrowerProfile = {
          grossIncome: 1000,
          age: 27,
          employmentStatus: 'FULL_TIME',
        };
        const borrowingPowerCalculation: AdjustedForEmploymentStatus = {
          borrowerProfile,
          baseBorrowingCapacity: 300,
          adjustedForEmploymentStatus: 300,
        };
        expect(adjustForAge(borrowingPowerCalculation)).toEqual({
          borrowerProfile,
          baseBorrowingCapacity: 300,
          adjustedForEmploymentStatus: 300,
          adjustedForAge: 300,
        });
      });
    });
    describe('for a borrower aged over 60 years of age', () => {
      it('reduces the age adjusted borrowing capacity by 10%', () => {
        const borrowerProfile: BorrowerProfile = {
          grossIncome: 1000,
          age: 65,
          employmentStatus: 'FULL_TIME',
        };
        const borrowingPowerCalculation: AdjustedForEmploymentStatus = {
          borrowerProfile,
          baseBorrowingCapacity: 300,
          adjustedForEmploymentStatus: 300,
        };
        expect(adjustForAge(borrowingPowerCalculation)).toEqual({
          borrowerProfile,
          baseBorrowingCapacity: 300,
          adjustedForEmploymentStatus: 300,
          adjustedForAge: 270,
        });
      });
    });
  });
});
