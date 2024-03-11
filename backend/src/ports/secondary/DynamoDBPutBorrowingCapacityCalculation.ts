import { EmploymentStatus } from '@/entities/EmploymentStatus';

export type PutBorrowingCapacityCalculationInput = {
  borrowingCapacityCalculationId: string;
  borrowerEmail: string;
  estimatedBorrowingCapacity: number;
  timestamp: string;
  grossAnnualIncome: number;
  employmentStatus: EmploymentStatus;
};
export type PutBorrowingCapacityCalculationPort = (
  borrowingCapacityCalculation: PutBorrowingCapacityCalculationInput
) => Promise<undefined>;
