import { getBorrowerProfile } from '@/adaptors/secondary/ddb-get-borrower-profile';
import { putBorrowingCapacityCalculation } from '@/adaptors/secondary/ddb-put-borrowing-capacity-calculation';
import { BorrowerProfileDoesNotExistError } from '@/errors/BorrowerProfileDoesNotExistError';
import { EmploymentStatus } from '@/types/api';
import { getYearsSinceCurrentDate } from '@/utils/get-years-since-current-date';
import { randomUUID } from 'node:crypto';
import { adjustForAge } from './adjust-for-age';
import { adjustForEmploymentStatus } from './adjust-for-employment-status';
import { calculateBaseBorrowingCapacity } from './calculate-base-borrowing-capacity';
export type CalculateBorrowingCapacityInput = {
  borrowerEmail: string;
  grossAnnualIncome: number;
  employmentStatus: EmploymentStatus;
};

export type CalculateBorrowingCapacityPort = (
  borrowingCapacityInput: CalculateBorrowingCapacityInput
) => Promise<number>;

const calculateAge = (dateOfBirth: Date): number =>
  getYearsSinceCurrentDate(dateOfBirth);

const calculateEstimatedBorrowingCapacity = (
  age: number,
  grossAnnualIncome: number,
  employmentStatus: EmploymentStatus
): number => {
  const baseBorrowingCapacity = calculateBaseBorrowingCapacity({
    age,
    grossAnnualIncome: grossAnnualIncome,
    employmentStatus: employmentStatus,
  });
  const adjustedForEmploymentStatus = adjustForEmploymentStatus(
    baseBorrowingCapacity
  );
  const { adjustedForAge } = adjustForAge(adjustedForEmploymentStatus);
  const estimatedBorrowingCapacity = adjustedForAge;
  return estimatedBorrowingCapacity;
};

export const calculateBorrowingCapacity: CalculateBorrowingCapacityPort =
  async (borrowingCapacityInput): Promise<number> => {
    const borrowerProfile = await getBorrowerProfile(
      borrowingCapacityInput.borrowerEmail
    );
    const borrowerNotFound = !borrowerProfile;
    if (borrowerNotFound) {
      throw new BorrowerProfileDoesNotExistError('Borrower profile not found');
    }

    const age = calculateAge(new Date(borrowerProfile.dob));
    const estimatedBorrowingCapacity = calculateEstimatedBorrowingCapacity(
      age,
      borrowingCapacityInput.grossAnnualIncome,
      borrowingCapacityInput.employmentStatus
    );

    await putBorrowingCapacityCalculation({
      borrowingCapacityCalculationId: randomUUID(),
      borrowerEmail: borrowingCapacityInput.borrowerEmail,
      estimatedBorrowingCapacity: estimatedBorrowingCapacity,
      timestamp: new Date().toISOString(),
      grossAnnualIncome: borrowingCapacityInput.grossAnnualIncome,
      employmentStatus: borrowingCapacityInput.employmentStatus,
    });
    return estimatedBorrowingCapacity;
  };
