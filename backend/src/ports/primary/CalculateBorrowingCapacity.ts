import { EmploymentStatus } from '@/types/api';
export type CalculateBorrowingCapacityInput = {
  borrowerEmail: string;
  grossAnnualIncome: number;
  employmentStatus: EmploymentStatus;
};

export type CalculateBorrowingCapacityPort = (
  borrowingCapacityInput: CalculateBorrowingCapacityInput
) => Promise<number>;
