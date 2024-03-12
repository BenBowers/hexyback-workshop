import { BorrowerProfileDoesNotExistError } from '@/errors/BorrowerProfileDoesNotExistError';
import { InternalError } from '@/errors/InternalError';
import { EmploymentStatus } from '@/types/api';
import { processLoanApplication } from '@/use-cases/loan-assessment/process-loan-application';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handler } from './api-gw-apply-for-loan';
describe('api gw apply for loan', () => {
  vi.mock('@/use-cases/loan-assessment/process-loan-application', () => ({
    processLoanApplication: vi.fn(() => Promise.resolve('APPROVED')),
  }));
  const processLoanApplicationSpy = vi.mocked(processLoanApplication);
  beforeEach(() => {
    vi.resetAllMocks();
    processLoanApplicationSpy.mockResolvedValue('APPROVED');
  });

  const borrowerEmail = 'john.doe@example.com';
  const grossAnnualIncome = 60_000;
  const employmentStatus: EmploymentStatus = 'FULL_TIME';
  const monthlyExpenses = 1500;
  describe('given an api gateway proxy event', () => {
    it(
      'extracts the borrowerEmail, grossIncome and employmentStatus, creditScore and monthlyExpenses from the request body ' +
        'and calls the process loan application use case',
      async () => {
        await handler(
          {
            body: JSON.stringify({
              borrowerEmail,
              grossAnnualIncome,
              employmentStatus,
              monthlyExpenses,
            }),
          } as unknown as APIGatewayProxyEvent,
          {} as Context,
          () => {}
        );
        expect(processLoanApplicationSpy).toHaveBeenCalledWith({
          borrowerEmail,
          grossAnnualIncome,
          employmentStatus,
          monthlyExpenses,
        });
      }
    );
    describe('given the use case resolves', () => {
      it(
        'resolves with a status code 201 and a body containing a json serialized object ' +
          'with key loanApplicationStatus set to the result of processLoanApplication',
        async () => {
          await expect(
            handler(
              {
                body: JSON.stringify({
                  borrowerEmail,
                  grossAnnualIncome,
                  employmentStatus,
                  monthlyExpenses,
                }),
              } as unknown as APIGatewayProxyEvent,
              {} as Context,
              () => {}
            )
          ).resolves.toStrictEqual({
            statusCode: 201,
            body: JSON.stringify({ loanApplicationStatus: 'APPROVED' }),
          });
        }
      );
    });
    describe('given the use case rejects with borrower not found', () => {
      it('resolves with a status code 400 and a message containing borrower with the provided email does not exist', async () => {
        processLoanApplicationSpy.mockRejectedValue(
          new BorrowerProfileDoesNotExistError(
            'Borrower profile does not exist'
          )
        );
        await expect(
          handler(
            {
              body: JSON.stringify({
                borrowerEmail,
                grossAnnualIncome,
                employmentStatus,
                monthlyExpenses,
              }),
            } as unknown as APIGatewayProxyEvent,
            {} as Context,
            () => {}
          )
        ).resolves.toStrictEqual({
          statusCode: 400,
          body: JSON.stringify({
            message: 'Borrower with the provided email does not exist',
          }),
        });
      });
    });
    describe('given the use case rejects with an internal error', () => {
      it('resolves to a status code 500 and a message containing Internal Server Error', async () => {
        processLoanApplicationSpy.mockRejectedValue(
          new InternalError('something went wrong')
        );
        await expect(
          handler(
            {
              body: JSON.stringify({
                borrowerEmail,
                grossAnnualIncome,
                employmentStatus,
                monthlyExpenses,
              }),
            } as unknown as APIGatewayProxyEvent,
            {} as Context,
            () => {}
          )
        ).resolves.toStrictEqual({
          statusCode: 500,
          body: JSON.stringify({
            message: 'Internal Server Error',
          }),
        });
      });
    });
  });
});
