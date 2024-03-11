import { EmploymentStatus } from '@/entities/EmploymentStatus';
import { LoanApplicationStatus } from '@/entities/LoanApplicationStatus';

export type PutLoanApplicationInput = {
  loanApplicationId: string;
  borrowerEmail: string;
  timestamp: string;
  creditScore: number;
  grossAnnualIncome: number;
  monthlyExpenses: number;
  loanApplicationStatus: LoanApplicationStatus;
  employmentStatus: EmploymentStatus;
};
export type PutLoanApplicationPort = (
  loanApplication: PutLoanApplicationInput
) => Promise<void>;
