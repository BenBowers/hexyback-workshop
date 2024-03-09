import { EmploymentStatus } from '@/types/api';
import { calculateBorrowingCapacity } from '@/use-cases/borrowing-capacity/calculate-borrowing-capacity';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { describe, expect, it, vi } from 'vitest';
import { handler } from './api-gw-calculate-borrowing-power';
describe('api gw calculate borrowing power', () => {
  vi.mock(
    '@/use-cases/borrowing-capacity/calculate-borrowing-capacity',
    () => ({
      calculateBorrowingCapacity: vi.fn(),
    })
  );
  const calculateBorrowingCapacitySpy = vi.mocked(calculateBorrowingCapacity);
  describe('given an api gateway proxy event', () => {
    it(
      'extracts the age, grossIncome and employmentStatus from the queryArguments ' +
        'and calls the calculate borrowing capacity use case',
      async () => {
        const age = 20;
        const grossIncome = 60_000;
        const employmentStatus: EmploymentStatus = 'FULL_TIME';
        await handler(
          {
            queryStringParameters: {
              age,
              grossIncome,
              employmentStatus,
            },
          } as unknown as APIGatewayProxyEvent,
          {} as Context,
          () => {}
        );
        expect(calculateBorrowingCapacitySpy).toHaveBeenCalledWith({
          age,
          grossIncome,
          employmentStatus,
        });
      }
    );
    it(
      'resolves with a status code 200 and a body containing a json serialized object ' +
        'with key estimatedBOrrowingCapacity set to the result of calculateBorrowingCapacity',
      async () => {
        calculateBorrowingCapacitySpy.mockReturnValue(200_000);
        await expect(
          handler(
            {
              queryStringParameters: {
                age: 20,
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
