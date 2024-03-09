import { BorrowerProfile } from './BorrowerProfile';

export type DetailedBorrowerProfile = BorrowerProfile & {
  monthlyExpenses: number;
  creditScore: number;
};
