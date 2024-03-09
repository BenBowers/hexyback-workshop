import { DetailedBorrowerProfile } from '@/entities/DetailedBorrowerProfile';
import { LoanApplicationStatus } from '@/entities/LoanApplicationStatus';
import { EmploymentStatus } from '@/types/api';
import { describe, expect, it } from 'vitest';
import { assessLoanApplication } from './assess-loan-application';

describe('Loan Application Evaluation', () => {
  // Test for age-related rejections
  it('should reject application due to invalid age', () => {
    const youngApplicant: DetailedBorrowerProfile = {
      age: 17,
      employmentStatus: 'FULL_TIME',
      grossIncome: 50000,
      monthlyExpenses: 1500,
      creditScore: 650,
    };
    const oldApplicant: DetailedBorrowerProfile = {
      age: 101,
      employmentStatus: 'FULL_TIME',
      grossIncome: 50000,
      monthlyExpenses: 1500,
      creditScore: 650,
    };
    expect(assessLoanApplication(youngApplicant)).resolves.toEqual('REJECTED');
    expect(assessLoanApplication(oldApplicant)).resolves.toEqual('REJECTED');
  });

  // Test for poor credit score
  it('should reject application due to poor credit score', () => {
    const applicant: DetailedBorrowerProfile = {
      age: 25,
      employmentStatus: 'FULL_TIME',
      grossIncome: 50000,
      monthlyExpenses: 2000,
      creditScore: 250,
    };
    expect(assessLoanApplication(applicant)).resolves.toEqual('REJECTED');
  });

  // Test for low credit but varying DTI
  it('should approve low credit but good DTI', () => {
    const applicant: DetailedBorrowerProfile = {
      age: 30,
      employmentStatus: 'FULL_TIME',
      grossIncome: 60000,
      monthlyExpenses: 1500,
      creditScore: 400,
    };
    expect(assessLoanApplication(applicant)).resolves.toEqual('APPROVED');
  });

  it('should review low credit, medium DTI', () => {
    const applicant: DetailedBorrowerProfile = {
      age: 30,
      employmentStatus: 'FULL_TIME',
      grossIncome: 60000,
      monthlyExpenses: 2500,
      creditScore: 400,
    };
    expect(assessLoanApplication(applicant)).resolves.toEqual('REVIEW');
  });

  it('should reject low credit, high DTI', () => {
    const applicant: DetailedBorrowerProfile = {
      age: 30,
      employmentStatus: 'FULL_TIME',
      grossIncome: 60000,
      monthlyExpenses: 35000,
      creditScore: 400,
    };
    expect(assessLoanApplication(applicant)).resolves.toEqual('REJECTED');
  });

  type DtiBoundary = 'low' | 'medium' | 'high';
  type TestScenario = {
    creditScore: number;
    result: LoanApplicationStatus;
    dtiBoundary: DtiBoundary;
    employmentStatus: EmploymentStatus;
    finalOutcome: string;
  };
  // Test for medium and high credit score with varying DTI and employment status
  const scenarios: TestScenario[] = [
    {
      creditScore: 500,
      result: 'REVIEW',
      dtiBoundary: 'medium',
      employmentStatus: 'PART_TIME',
      finalOutcome:
        'review application with medium credit, medium DTI, and part-time employment',
    },
    {
      creditScore: 500,
      result: 'REJECTED',
      dtiBoundary: 'high',
      employmentStatus: 'FULL_TIME',
      finalOutcome:
        'reject application with medium credit, high DTI, and full-time employment',
    },
    {
      creditScore: 700,
      result: 'REVIEW',
      dtiBoundary: 'medium',
      employmentStatus: 'CASUAL',
      finalOutcome:
        'review application with good credit, medium DTI, and casual employment',
    },
    {
      creditScore: 700,
      result: 'REJECTED',
      dtiBoundary: 'high',
      employmentStatus: 'SELF_EMPLOYED',
      finalOutcome:
        'reject application with good credit, high DTI, and self-employed status',
    },
    {
      creditScore: 600,
      result: 'APPROVED',
      dtiBoundary: 'low',
      employmentStatus: 'FULL_TIME',
      finalOutcome:
        'approve application with medium credit, low DTI, and full-time employment',
    },
    {
      creditScore: 600,
      result: 'REVIEW',
      dtiBoundary: 'low',
      employmentStatus: 'PART_TIME',
      finalOutcome:
        'review application with medium credit, low DTI, and part-time employment',
    },
    {
      creditScore: 800,
      result: 'APPROVED',
      dtiBoundary: 'low',
      employmentStatus: 'FULL_TIME',
      finalOutcome:
        'approve application with high credit, low DTI, and full-time employment',
    },
    {
      creditScore: 800,
      result: 'REVIEW',
      dtiBoundary: 'low',
      employmentStatus: 'CASUAL',
      finalOutcome:
        'review application with high credit, low DTI, and casual employment',
    },
  ];

  scenarios.forEach(
    ({ creditScore, result, dtiBoundary, employmentStatus, finalOutcome }) => {
      it(`should ${finalOutcome}`, () => {
        const grossIncome = 100000;
        const monthlyProratedGrossIncome = grossIncome / 12;
        const dtiBoundaryToMonthlyExpenses: Record<DtiBoundary, number> = {
          low: 0.24 * monthlyProratedGrossIncome,
          medium: 0.36 * monthlyProratedGrossIncome,
          high: 0.6 * monthlyProratedGrossIncome,
        };
        const applicant: DetailedBorrowerProfile = {
          age: 35,
          employmentStatus,
          grossIncome,
          monthlyExpenses: dtiBoundaryToMonthlyExpenses[dtiBoundary],
          creditScore: creditScore,
        };
        expect(assessLoanApplication(applicant)).resolves.toEqual(
          result.toUpperCase()
        );
      });
    }
  );
});
