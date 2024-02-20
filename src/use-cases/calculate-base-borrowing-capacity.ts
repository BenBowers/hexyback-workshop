import { BorrowerProfile } from '@/entities/BorrowerProfile';
import { BaseBorrowingCapacity } from '@/entities/BorrowingPowerCalculation';

const calculateBaseBorrowingCapacity = (
  borrowerProfile: BorrowerProfile
): BaseBorrowingCapacity => {
  return {
    borrowerProfile,
    baseBorrowingCapacity: borrowerProfile.grossIncome * 0.3,
  };
};

export default calculateBaseBorrowingCapacity;
