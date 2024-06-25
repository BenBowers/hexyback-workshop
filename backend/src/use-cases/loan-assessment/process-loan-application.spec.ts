import { getBorrowerProfile } from '@/adaptors/secondary/ddb-get-borrower-profile';
import { putLoanApplication } from '@/adaptors/secondary/ddb-put-loan-application';
import { BorrowerProfileDoesNotExistError } from '@/errors/BorrowerProfileDoesNotExistError';
import { InternalError } from '@/errors/InternalError';
import { ProcessLoanApplicationInput } from '@/ports/primary/ProcessLoanApplication';
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
import { assessLoanApplication } from './assess-loan-application';
import { processLoanApplication } from './process-loan-application';

describe('process loan-application', () => {
  vi.mock('@/adaptors/secondary/ddb-get-borrower-profile', () => ({
    getBorrowerProfile: vi.fn(() => Promise.resolve(undefined)),
  }));
  const getBorrowerProfileSpy = vi.mocked(getBorrowerProfile);

  const borrowerProfile: BorrowerProfile = {
    dob: '1981-11-02',
    email: 'john.doe@example.com',
    name: 'John Doe',
    creditScore: 500,
  };
  vi.mock('@/adaptors/secondary/ddb-put-loan-application', () => ({
    putLoanApplication: vi.fn(() => Promise.resolve(undefined)),
  }));
  const putLoanApplicationSpy = vi.mocked(putLoanApplication);

  vi.mock('./assess-loan-application', () => ({
    assessLoanApplication: vi.fn(() => Promise.resolve(undefined)),
  }));
  const assessLoanApplicationSpy = vi.mocked(assessLoanApplication);

  const processLoanApplicationInput: ProcessLoanApplicationInput = {
    borrowerEmail: 'john.doe@example.com',
    employmentStatus: 'FULL_TIME',
    grossAnnualIncome: 100000,
    monthlyExpenses: 5000,
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
    assessLoanApplicationSpy.mockReturnValue('APPROVED');
  });

  describe('given a borrower email, gross annual income, employment status and monthly expenses', () => {
<<<<<<< HEAD
    const systemTime = new Date(2024, 2, 15);
    const mockedTimestamp = systemTime.toISOString();
  
    beforeAll(() => {
      vi.useFakeTimers();
      vi.setSystemTime(systemTime);
    });
    afterAll(() => {
      vi.useRealTimers();
    });
    it('fetches the borrowers profile from the database', async () => {
=======
    it.todo('fetches the borrowers profile from the database', async () => {
>>>>>>> b68768227ce2f955339505e0860db375d7e59eb0
      await processLoanApplication(processLoanApplicationInput);
      expect(getBorrowerProfileSpy).toHaveBeenCalledWith(
        processLoanApplicationInput.borrowerEmail
      );
    });
    describe('given the borrower profile is not found', () => {
<<<<<<< HEAD
      it('rejects with borrower not found error', async () => {
=======
      it.todo('rejects with borrower not found error', async () => {
>>>>>>> b68768227ce2f955339505e0860db375d7e59eb0
        getBorrowerProfileSpy.mockResolvedValue(undefined);
        await expect(
          processLoanApplication(processLoanApplicationInput)
        ).rejects.toBeInstanceOf(BorrowerProfileDoesNotExistError);
      });
    });
    describe('given the get borrower profile adaptor rejects with an internal error', () => {
<<<<<<< HEAD
      it('rejects with the error', async () => {});
=======
      it.todo('rejects with the error', async () => {});
>>>>>>> b68768227ce2f955339505e0860db375d7e59eb0
    });
    describe('given the borrower profile is successfully retrieved', () => {
      it.todo(
        'calls the assess loan application use case with the ' +
          'borrowers age, employment status, gross annual income, monthly expenses and credit score',
        async () => {}
      );
      it.todo('writes the loan application to the database', async () => {});
      describe('given the write to the database succeeds', () => {
<<<<<<< HEAD
        it('resolves with the loan application status', async () => {
          return expect(
            processLoanApplication(processLoanApplicationInput)
          ).resolves.toEqual('APPROVED');
        });
      });
      describe('given the write to the database rejects', () => {
        it('rejects with the error', () => {
          const error = new InternalError('Cheers Clint');
          putLoanApplicationSpy.mockRejectedValue(error);
          return expect(
            processLoanApplication(processLoanApplicationInput)
          ).rejects.toBe(error);
        });
=======
        it.todo('resolves with the loan application status', async () => {});
      });
      describe('given the write to the database rejects', () => {
        it.todo('rejects with the error', async () => {});
>>>>>>> b68768227ce2f955339505e0860db375d7e59eb0
      });
    });
  });
});
