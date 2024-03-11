import { BaseBorrowingCapacity } from '@/entities/BorrowingCapacityCalculation';
import { BorrowingCapacityCalculationInput } from '@/entities/BorrowingCapacityCalculationInput';

export const calculateBaseBorrowingCapacity = (
  borrowerProfile: BorrowingCapacityCalculationInput
): BaseBorrowingCapacity => {
  return {
    borrowerProfile,
    baseBorrowingCapacity: borrowerProfile.grossAnnualIncome * 0.3,
  };
};
