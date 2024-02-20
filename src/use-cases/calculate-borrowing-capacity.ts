import { BorrowerProfile } from '@/entities/BorrowerProfile';
import adjustForAge from './adjust-for-age';
import adjustForEmploymentStatus from './adjust-for-employment-status';
import calculateBaseBorrowingCapacity from './calculate-base-borrowing-capacity';
const calculateBorrowingCapacity = (
  borrowerProfile: BorrowerProfile
): number => {
  const baseBorrowingCapacity = calculateBaseBorrowingCapacity(borrowerProfile);
  const adjustedForEmploymentStatus = adjustForEmploymentStatus(
    baseBorrowingCapacity
  );
  const { adjustedForAge } = adjustForAge(adjustedForEmploymentStatus);
  return adjustedForAge;
};
export default calculateBorrowingCapacity;
