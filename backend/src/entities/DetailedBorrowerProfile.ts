import { BorrowingCapacityCalculationInput } from './BorrowingCapacityCalculationInput';

export type DetailedBorrowerProfile = BorrowingCapacityCalculationInput & {
  monthlyExpenses: number;
  creditScore: number;
};
