import { EmploymentStatus } from '@/types/api';
import { assessLoanApplication } from '@/use-cases/loan-assessment/assess-loan-application';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { describe, expect, it, vi } from 'vitest';
import { handler } from './api-gw-apply-for-loan';
describe('api gw apply for loan', () => {
  vi.mock('@/use-cases/loan-assessment/assess-loan-application', () => ({
    assessLoanApplication: vi.fn(),
  }));

  const assessLoanApplicationSpy = vi.mocked(assessLoanApplication);

  describe('given an api gateway proxy event', () => {
    it(
      'extracts the age, grossIncome and employmentStatus, creditScore and monthlyExpenses from the request body ' +
        'and calls the assess loan application use case',
      async () => {
        const grossAnnualIncome = 60_000;
        const employmentStatus: EmploymentStatus = 'FULL_TIME';
        const monthlyExpenses = 1500;
        await handler(
          {
            body: JSON.stringify({
              grossAnnualIncome,
              employmentStatus,
              monthlyExpenses,
            }),
          } as unknown as APIGatewayProxyEvent,
          {} as Context,
          () => {}
        );
        expect(assessLoanApplicationSpy).toHaveBeenCalledWith({
          grossAnnualIncome,
          employmentStatus,
          monthlyExpenses,
          age: 20,
          creditScore: 500,
        });
      }
    );
    it(
      'resolves with a status code 200 and a body containing a json serialized object ' +
        'with key loanApplicationStatus set to the result of assessLoanApplication',
      async () => {
        assessLoanApplicationSpy.mockResolvedValue('APPROVED');
        const age = 20;
        const grossIncome = 60_000;
        const employmentStatus: EmploymentStatus = 'FULL_TIME';
        const monthlyExpenses = 1500;
        const creditScore = 600;
        await expect(
          handler(
            {
              body: JSON.stringify({
                age,
                grossIncome,
                employmentStatus,
                monthlyExpenses,
                creditScore,
              }),
            } as unknown as APIGatewayProxyEvent,
            {} as Context,
            () => {}
          )
        ).resolves.toStrictEqual({
          statusCode: 200,
          body: JSON.stringify({ loanApplicationStatus: 'APPROVED' }),
        });
      }
    );
  });
});
