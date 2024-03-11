import { getBorrowerProfile } from '@/adaptors/secondary/ddb-get-borrower-profile';
import { putBorrowingCapacityCalculation } from '@/adaptors/secondary/ddb-put-borrowing-capacity-calculation';
import { BorrowerProfileDoesNotExistError } from '@/errors/BorrowerProfileDoesNotExistError';
import { InternalError } from '@/errors/InternalError';
import { CalculateBorrowingCapacityInput } from '@/ports/primary/CalculateBorrowingCapacity';
import { BorrowerProfile } from '@/types/api';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { calculateBorrowingCapacity } from './calculate-borrowing-capacity';
describe('borrowing-capacity', () => {
  vi.mock('@/adaptors/secondary/ddb-get-borrower-profile', () => ({
    getBorrowerProfile: vi.fn(() => Promise.resolve(undefined)),
  }));
  const getBorrowerProfileSpy = vi.mocked(getBorrowerProfile);
  vi.mock(
    '@/adaptors/secondary/ddb-put-borrowing-capacity-calculation',
    () => ({
      putBorrowingCapacityCalculation: vi.fn(() => Promise.resolve(undefined)),
    })
  );
  const putBorrowingCapacityCalculationSpy = vi.mocked(
    putBorrowingCapacityCalculation
  );
  const calculateBorrowingCapacityInput: CalculateBorrowingCapacityInput = {
    borrowerEmail: 'john.doe@example',
    grossAnnualIncome: 60_000,
    employmentStatus: 'FULL_TIME',
  };
  const borrowerProfile: BorrowerProfile = {
    dob: '1981-11-02',
    email: 'john.doe@example',
    name: 'John Doe',
    creditScore: 500,
  };
  const systemTime = new Date(2024, 2, 15);
  const mockedTimestamp = systemTime.toISOString();
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  beforeEach(() => {
    vi.resetAllMocks();
    getBorrowerProfileSpy.mockResolvedValue(borrowerProfile);
    putBorrowingCapacityCalculationSpy.mockResolvedValue(undefined);
  });

  describe('Given a borrower email, gross annual income and employment status', () => {
    it('fetches the borrowers profile from the database', async () => {
      await calculateBorrowingCapacity(calculateBorrowingCapacityInput);
      expect(getBorrowerProfileSpy).toHaveBeenCalledWith(
        calculateBorrowingCapacityInput.borrowerEmail
      );
    });
    describe('given the borrower profile is not found', () => {
      it('rejects with borrower not found error', async () => {
        getBorrowerProfileSpy.mockResolvedValue(undefined);
        await expect(
          calculateBorrowingCapacity(calculateBorrowingCapacityInput)
        ).rejects.toBeInstanceOf(BorrowerProfileDoesNotExistError);
      });
    });
    describe('given the borrower profile is found', () => {
      it('writes the calculated borrowing capacity to the database', async () => {
        await calculateBorrowingCapacity(calculateBorrowingCapacityInput);
        expect(putBorrowingCapacityCalculationSpy).toHaveBeenCalledWith({
          borrowingCapacityCalculationId: expect.anything(),
          borrowerEmail: calculateBorrowingCapacityInput.borrowerEmail,
          estimatedBorrowingCapacity: 18000,
          grossAnnualIncome: calculateBorrowingCapacityInput.grossAnnualIncome,
          employmentStatus: calculateBorrowingCapacityInput.employmentStatus,
          timestamp: mockedTimestamp,
        });
      });
      describe('given the write to the database fails', () => {
        it('rejects with the error', async () => {
          const error = new InternalError('something went wrong');
          putBorrowingCapacityCalculationSpy.mockRejectedValue(error);
          await expect(
            calculateBorrowingCapacity(calculateBorrowingCapacityInput)
          ).rejects.toBe(error);
        });
      });
      describe('given the write to the database succeeds', () => {
        it('resolves with the borrowing capacity', async () => {
          await expect(
            calculateBorrowingCapacity(calculateBorrowingCapacityInput)
          ).resolves.toEqual(18000);
        });
      });
    });
  });
});
