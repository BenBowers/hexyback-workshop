import { BorrowingCapacityCalculationInput } from './BorrowingCapacityCalculationInput';

export type BaseBorrowingCapacity = {
  borrowerProfile: BorrowingCapacityCalculationInput;
  baseBorrowingCapacity: number;
};

export type AdjustedForEmploymentStatus = BaseBorrowingCapacity & {
  adjustedForEmploymentStatus: number;
};

export type AdjustedForAge = AdjustedForEmploymentStatus & {
  adjustedForAge: number;
};

export type BorrowingCapacity =
  | BaseBorrowingCapacity
  | AdjustedForEmploymentStatus
  | AdjustedForAge;
