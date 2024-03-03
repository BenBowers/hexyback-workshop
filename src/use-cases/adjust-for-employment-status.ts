import {
  AdjustedForEmploymentStatus,
  BaseBorrowingCapacity,
} from '@/entities/BorrowingPowerCalculation';
import { EmploymentStatus } from '@/types/api';

export const adjustForEmploymentStatus = (
  borrowingPowerCalculation: BaseBorrowingCapacity
): AdjustedForEmploymentStatus => {
  const employmentStatus =
    borrowingPowerCalculation.borrowerProfile.employmentStatus;

  const baseBorrowingCapacity = borrowingPowerCalculation.baseBorrowingCapacity;

  const employmentStatusAdjustmentFactor: Record<EmploymentStatus, number> = {
    FULL_TIME: 1.0,
    PART_TIME: 0.9,
    CASUAL: 0.8,
    SELF_EMPLOYED: 0.75,
  };

  const adjustedForEmploymentStatus =
    employmentStatusAdjustmentFactor[employmentStatus] * baseBorrowingCapacity;

  return {
    borrowerProfile: { ...borrowingPowerCalculation.borrowerProfile },
    baseBorrowingCapacity: borrowingPowerCalculation.baseBorrowingCapacity,
    adjustedForEmploymentStatus,
  };
};
