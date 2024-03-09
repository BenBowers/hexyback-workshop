import { DetailedBorrowerProfile } from '@/entities/DetailedBorrowerProfile';
import { LoanApplicationStatus } from '@/entities/LoanApplicationStatus';

const lowerAgeBoundary = 18;
const upperAgeBoundary = 100;
const lowerDtiUpperBoundary = 0.35;
const midDtiUpperBoundary = 0.5;

const invalidCreditScoreUpperBoundary = 300;
const lowCreditScoreUpperBoundary = 500;
const midCreditScoreUpperBoundary = 700;

export const assessLoanApplication = (
  applicant: DetailedBorrowerProfile
): LoanApplicationStatus => {
  // Validate age
  if (applicant.age < lowerAgeBoundary || applicant.age > upperAgeBoundary) {
    return 'REJECTED';
  }

  // Validate credit score
  if (applicant.creditScore < invalidCreditScoreUpperBoundary) {
    return 'REJECTED';
  }
  const monthlyProratedGrossIncome = applicant.grossIncome / 12;
  // Calculate DTI (Debt-to-Income Ratio)
  const dti = applicant.monthlyExpenses / monthlyProratedGrossIncome;

  // Decision logic based on credit score and DTI
  if (applicant.creditScore < lowCreditScoreUpperBoundary) {
    // Low credit score scenarios
    if (dti < lowerDtiUpperBoundary) {
      return 'APPROVED';
    } else if (dti <= midDtiUpperBoundary) {
      return 'REVIEW';
    } else {
      return 'REJECTED';
    }
  } else if (applicant.creditScore < midCreditScoreUpperBoundary) {
    // Medium credit score scenarios
    if (dti < lowerDtiUpperBoundary) {
      return applicant.employmentStatus === 'FULL_TIME' ? 'APPROVED' : 'REVIEW';
    } else if (dti <= midDtiUpperBoundary) {
      return 'REVIEW';
    } else {
      return 'REJECTED';
    }
  } else {
    // High credit score scenarios
    if (dti < lowerDtiUpperBoundary) {
      return applicant.employmentStatus === 'FULL_TIME' ? 'APPROVED' : 'REVIEW';
    } else if (dti <= midDtiUpperBoundary) {
      return 'REVIEW';
    } else {
      return 'REJECTED';
    }
  }
};
