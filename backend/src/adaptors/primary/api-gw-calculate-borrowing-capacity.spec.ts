import { BorrowerProfileDoesNotExistError } from '@/errors/BorrowerProfileDoesNotExistError';
import { EmploymentStatus } from '@/types/api';
import { calculateBorrowingCapacity } from '@/use-cases/borrowing-capacity/calculate-borrowing-capacity';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { describe, expect, it, vi } from 'vitest';
import { handler } from './api-gw-calculate-borrowing-capacity';
describe('api gw calculate borrowing capacity', () => {
  vi.mock(
    '@/use-cases/borrowing-capacity/calculate-borrowing-capacity',
    () => ({
      calculateBorrowingCapacity: vi.fn(() => Promise.resolve(1)),
    })
  );
  const calculateBorrowingCapacitySpy = vi.mocked(calculateBorrowingCapacity);
  describe('given an api gateway proxy event', () => {
    it(
      'extracts the borrowerEmail, grossIncome and employmentStatus from the queryArguments ' +
        'and calls the calculate borrowing capacity use case',
      async () => {
        const borrowerEmail = 'john.doe@example.com';
        const grossAnnualIncome = 60_000;
        const employmentStatus: EmploymentStatus = 'FULL_TIME';
        await handler(
          {
            queryStringParameters: {
              borrowerEmail,
              grossAnnualIncome,
              employmentStatus,
            },
          } as unknown as APIGatewayProxyEvent,
          {} as Context,
          () => {}
        );
        expect(calculateBorrowingCapacitySpy).toHaveBeenCalledWith({
          borrowerEmail,
          grossAnnualIncome,
          employmentStatus,
        });
      }
    );
    describe('given the use case rejects with borrower profile does not exist error', () => {
      it('resolves with a status code 400 and a body containing a json serialized object with key message set to Borrower with the provided email does not exist', async () => {
        calculateBorrowingCapacitySpy.mockRejectedValue(
          new BorrowerProfileDoesNotExistError(
            'Borrower with the provided email does not exist'
          )
        );
        const borrowerEmail = 'john.doe@example.com';
        const grossAnnualIncome = 60_000;
        const employmentStatus: EmploymentStatus = 'FULL_TIME';
        await expect(
          handler(
            {
              queryStringParameters: {
                borrowerEmail,
                grossAnnualIncome,
                employmentStatus,
              },
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
    describe('given the use case rejects with an unhandled error', () => {
      it('resolves with a status code 500 and a body containing a json serialized object with key message set to Internal Server Error', async () => {
        calculateBorrowingCapacitySpy.mockRejectedValue(new Error('Unhandled'));
        await expect(
          handler(
            {
              queryStringParameters: {
                borrowerEmail: 'john.doe@example.com',
                grossIncome: 60_000,
                employmentStatus: 'FULL_TIME',
              },
            } as unknown as APIGatewayProxyEvent,
            {} as Context,
            () => {}
          )
        ).resolves.toStrictEqual({
          statusCode: 500,
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      });
    });
    describe('given the use case resolves', () => {
      it(
        'resolves with a status code 200 and a body containing a json serialized object ' +
          'with key estimatedBOrrowingCapacity set to the result of calculateBorrowingCapacity',
        async () => {
          calculateBorrowingCapacitySpy.mockResolvedValue(200_000);
          await expect(
            handler(
              {
                queryStringParameters: {
                  borrowerEmail: 'john.doe@example.com',
                  grossIncome: 60_000,
                  employmentStatus: 'FULL_TIME',
                },
              } as unknown as APIGatewayProxyEvent,
              {} as Context,
              () => {}
            )
          ).resolves.toStrictEqual({
            statusCode: 200,
            body: JSON.stringify({ estimatedBorrowingCapacity: 200_000 }),
          });
        }
      );
    });
  });
});
