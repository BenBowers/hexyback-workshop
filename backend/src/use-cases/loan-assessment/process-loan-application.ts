import { getBorrowerProfile } from '@/adaptors/secondary/ddb-get-borrower-profile';
import { putLoanApplication } from '@/adaptors/secondary/ddb-put-loan-application';
import { BorrowerProfileDoesNotExistError } from '@/errors/BorrowerProfileDoesNotExistError';
import { ProcessLoanApplicationPort } from '@/ports/primary/ProcessLoanApplication';
import { getYearsSinceCurrentDate } from '@/utils/get-years-since-current-date';
import { randomUUID } from 'crypto';
import { assessLoanApplication } from './assess-loan-application';

const calculateAge = (dateOfBirth: Date): number =>
  getYearsSinceCurrentDate(dateOfBirth);

export const processLoanApplication: ProcessLoanApplicationPort = async ({
  borrowerEmail,
  grossAnnualIncome,
  employmentStatus,
  monthlyExpenses,
}) => {};
