import { BaseBorrowingCapacity } from '@/entities/BorrowingPowerCalculation';
import { describe, expect, it } from 'vitest';
import { BorrowerProfile } from '../entities/BorrowerProfile';
import adjustForEmploymentStatus from './adjust-for-employment-status';
describe('adjust-for-employment-status', () => {
  describe('Given a base borrowing capacity', () => {
    describe('for a full-time employee', () => {
      it('does nothing', () => {
        const borrowerProfile: BorrowerProfile = {
          grossIncome: 1000,
          age: 18,
          employmentStatus: 'FULL_TIME',
        };
        const borrowingPowerCalculation: BaseBorrowingCapacity = {
          borrowerProfile,
          baseBorrowingCapacity: 300,
        };
        expect(adjustForEmploymentStatus(borrowingPowerCalculation)).toEqual({
          borrowerProfile,
          baseBorrowingCapacity: 300,
          adjustedForEmploymentStatus: 300,
        });
      });
    });
    describe('for a part-time employee', () => {
      it('reduces the base borrowing capacity by 10%', () => {
        const borrowerProfile: BorrowerProfile = {
          grossIncome: 1000,
          age: 18,
          employmentStatus: 'PART_TIME',
        };
        const borrowingPowerCalculation: BaseBorrowingCapacity = {
          borrowerProfile,
          baseBorrowingCapacity: 300,
        };
        expect(adjustForEmploymentStatus(borrowingPowerCalculation)).toEqual({
          borrowerProfile,
          baseBorrowingCapacity: 300,
          adjustedForEmploymentStatus: 270,
        });
      });
    });
    describe('for a casual employee', () => {
      it('reduces the base borrowing capacity by 20%', () => {
        const borrowerProfile: BorrowerProfile = {
          grossIncome: 1000,
          age: 18,
          employmentStatus: 'CASUAL',
        };
        const borrowingPowerCalculation: BaseBorrowingCapacity = {
          borrowerProfile,
          baseBorrowingCapacity: 300,
        };
        expect(adjustForEmploymentStatus(borrowingPowerCalculation)).toEqual({
          borrowerProfile,
          baseBorrowingCapacity: 300,
          adjustedForEmploymentStatus: 240,
        });
      });
    });
    describe('for a self-employed individual', () => {
      it('reduces the base borrowing capacity by 25%', () => {
        const borrowerProfile: BorrowerProfile = {
          grossIncome: 1000,
          age: 18,
          employmentStatus: 'SELF_EMPLOYED',
        };
        const borrowingPowerCalculation: BaseBorrowingCapacity = {
          borrowerProfile,
          baseBorrowingCapacity: 300,
        };
        expect(adjustForEmploymentStatus(borrowingPowerCalculation)).toEqual({
          borrowerProfile,
          baseBorrowingCapacity: 300,
          adjustedForEmploymentStatus: 225,
        });
      });
    });
  });
});
