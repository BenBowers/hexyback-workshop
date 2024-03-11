import { EmploymentStatus, LoanApplicationStatus } from '@/types/api';

export type ProcessLoanApplicationInput = {
  borrowerEmail: string;
  grossAnnualIncome: number;
  employmentStatus: EmploymentStatus;
  monthlyExpenses: number;
};
export type ProcessLoanApplicationPort = (
  ProcessLoanApplicationInput: ProcessLoanApplicationInput
) => Promise<LoanApplicationStatus>;
