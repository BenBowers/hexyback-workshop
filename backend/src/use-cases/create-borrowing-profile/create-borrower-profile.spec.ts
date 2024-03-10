import { getBorrowerProfile } from '@/adaptors/secondary/ddb-get-borrower-profile';
import { putBorrowerProfile } from '@/adaptors/secondary/ddb-put-borrower-profile';
import { BorrowerProfileAlreadyExistsError } from '@/errors/BorrowerProfileAlreadyExistsError';
import { InternalError } from '@/errors/InternalError';
import { BorrowerProfile } from '@/types/api';
import { describe, expect, it, vi } from 'vitest';
import { createBorrowerProfile } from './create-borrower-profile';
describe('create-borrower-profile', () => {
  vi.mock('@/adaptors/secondary/ddb-get-borrower-profile', () => ({
    getBorrowerProfile: vi.fn(),
  }));
  vi.mock('@/adaptors/secondary/ddb-put-borrower-profile', () => ({
    putBorrowerProfile: vi.fn(),
  }));
  const putBorrowerProfileSpy = vi.mocked(putBorrowerProfile);
  const getBorrowerProfileSpy = vi.mocked(getBorrowerProfile);
  const borrowerProfile: BorrowerProfile = {
    creditScore: 500,
    dob: '1981-11-02',
    email: 'john.doe@example',
    name: 'John Doe',
  };
  describe('given a borrower profile', () => {
    it('calls the get borrower profile adaptor with the borrower profile email', async () => {
      await createBorrowerProfile(borrowerProfile);
      expect(getBorrowerProfileSpy).toHaveBeenCalledWith(borrowerProfile.email);
    });
    describe('given the get borrower profile adaptor rejects with an error', () => {
      it('rejects with the error', async () => {
        const error = new InternalError('Something went wrong');
        getBorrowerProfileSpy.mockRejectedValue(error);
        await expect(createBorrowerProfile(borrowerProfile)).rejects.toBe(
          error
        );
      });
    });
    describe('given the get borrower profile adaptor resolves with a borrower profile', () => {
      it('rejects with a borrower profile already exists error', async () => {
        getBorrowerProfileSpy.mockResolvedValue(borrowerProfile);
        await expect(
          createBorrowerProfile(borrowerProfile)
        ).rejects.toBeInstanceOf(BorrowerProfileAlreadyExistsError);
      });
    });
    describe('given the get borrower profile adaptor resolves with undefined', () => {
      it('calls the put borrower profile adaptor with the borrower profile', async () => {
        getBorrowerProfileSpy.mockResolvedValue(undefined);
        await createBorrowerProfile(borrowerProfile);
        expect(putBorrowerProfileSpy).toHaveBeenCalledWith(borrowerProfile);
      });
      describe('given the put borrower profile adaptor rejects with an error', () => {
        it('rejects with the error', async () => {
          getBorrowerProfileSpy.mockResolvedValue(undefined);
          const error = new InternalError('Something went wrong');
          putBorrowerProfileSpy.mockRejectedValue(error);
          await expect(createBorrowerProfile(borrowerProfile)).rejects.toBe(
            error
          );
        });
      });
      describe('given the put borrower profile adaptor resolves', () => {
        it('resolves with the borrower profile', () => {
          getBorrowerProfileSpy.mockResolvedValue(undefined);
          putBorrowerProfileSpy.mockResolvedValue(undefined);
          expect(createBorrowerProfile(borrowerProfile)).resolves.toStrictEqual(
            borrowerProfile
          );
        });
      });
    });
  });
});
