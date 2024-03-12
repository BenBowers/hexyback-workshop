import { getBorrowerProfile } from '@/adaptors/secondary/ddb-get-borrower-profile';
import { putLoanApplication } from '@/adaptors/secondary/ddb-put-loan-application';
import { BorrowerProfileDoesNotExistError } from '@/errors/BorrowerProfileDoesNotExistError';
import { EmploymentStatus } from '@/types/api';
import { getYearsSinceCurrentDate } from '@/utils/get-years-since-current-date';
import { randomUUID } from 'crypto';
import { assessLoanApplication } from './assess-loan-application';

export type ProcessLoanApplicationInput = {
  borrowerEmail: string;
  grossAnnualIncome: number;
  employmentStatus: EmploymentStatus;
  monthlyExpenses: number;
};
export type ProcessLoanApplicationPort = (
  ProcessLoanApplicationInput: ProcessLoanApplicationInput
) => Promise<void>;

const calculateAge = (dateOfBirth: Date): number =>
  getYearsSinceCurrentDate(dateOfBirth);

export const processLoanApplication: ProcessLoanApplicationPort = async ({
  borrowerEmail,
  grossAnnualIncome,
  employmentStatus,
  monthlyExpenses,
}) => {
  const borrowerProfile = await getBorrowerProfile(borrowerEmail);
  if (!borrowerProfile) {
    throw new BorrowerProfileDoesNotExistError('Borrower profile not found');
  }
  const { creditScore, dob } = borrowerProfile;
  const loanApplicationStatus = assessLoanApplication({
    grossAnnualIncome,
    employmentStatus,
    monthlyExpenses,
    creditScore,
    age: calculateAge(new Date(dob)),
  });

  await putLoanApplication({
    borrowerEmail,
    loanApplicationId: randomUUID(),
    timestamp: new Date().toISOString(),
    creditScore,
    grossAnnualIncome,
    monthlyExpenses,
    loanApplicationStatus,
    employmentStatus,
  });
};
