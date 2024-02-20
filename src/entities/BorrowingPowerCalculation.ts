import { BorrowerProfile } from './BorrowerProfile';

export type BaseBorrowingCapacity = {
  borrowerProfile: BorrowerProfile;
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
