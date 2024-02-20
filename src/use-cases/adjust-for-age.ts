import {
  AdjustedForAge,
  AdjustedForEmploymentStatus,
} from '@/entities/BorrowingPowerCalculation';

const adjustForAge = (
  borrowingPowerCalculation: AdjustedForEmploymentStatus
): AdjustedForAge => {
  const adjustedForEmploymentStatus =
    borrowingPowerCalculation.adjustedForEmploymentStatus;
  const age = borrowingPowerCalculation.borrowerProfile.age;
  let adjustedForAge;
  if (age < 25 || age > 60) {
    adjustedForAge = adjustedForEmploymentStatus * 0.9;
  } else {
    adjustedForAge = adjustedForEmploymentStatus;
  }
  return {
    borrowerProfile: { ...borrowingPowerCalculation.borrowerProfile },
    baseBorrowingCapacity: borrowingPowerCalculation.baseBorrowingCapacity,
    adjustedForEmploymentStatus,
    adjustedForAge,
  };
};

export default adjustForAge;
