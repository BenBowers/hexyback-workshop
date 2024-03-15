import { putBorrowerProfile } from '@/adaptors/secondary/ddb-put-borrower-profile';
import { BorrowerProfile } from '@/types/api';
import { randomUUID } from 'crypto';
import { afterEach, describe, expect, it } from 'vitest';
import {
  deleteBorrowerProfile,
  getBorrowerProfile,
} from '../utils/borrower-profile-ddb';

describe('ddb-put-borrower-profile', () => {
  const borrowerProfile: BorrowerProfile = {
    dob: '1981-11-02',
    creditScore: 500,
    email: `me+${randomUUID()}@you.com`,
    name: 'Jill Jerkson',
  };
  afterEach(async () => {
    await deleteBorrowerProfile(borrowerProfile.email);
  });
  it(
    'writes a borrower profile record with PK of email and SK of BORROWER ' +
      'given a valid borrower profile entity',
    async () => {
      await putBorrowerProfile(borrowerProfile);
      await expect(
        getBorrowerProfile(borrowerProfile.email)
      ).resolves.toMatchObject({
        pk: borrowerProfile.email,
        sk: 'BORROWER',
        dob: borrowerProfile.dob,
        email: borrowerProfile.email,
        creditScore: borrowerProfile.creditScore,
      });
    }
  );
});
