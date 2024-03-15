import { getBorrowerProfile } from '@/adaptors/secondary/ddb-get-borrower-profile';
import { BorrowerProfile } from '@/types/api';
import { randomUUID } from 'crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  deleteBorrowerProfile,
  putBorrowerProfile,
} from '../utils/borrower-profile-ddb';

describe('ddb-get-borrower-profile', () => {
  const borrowerProfile: BorrowerProfile = {
    dob: '1981-11-02',
    creditScore: 500,
    email: `me+${randomUUID()}@you.com`,
    name: 'Jill Jerkson',
  };
  beforeEach(async () => {
    await putBorrowerProfile(borrowerProfile);
  });
  afterEach(async () => {
    await deleteBorrowerProfile(borrowerProfile.email);
  });
  it('retrieves an existing borrower profile given a valid borrower profile email', async () => {
    await putBorrowerProfile(borrowerProfile);
    await expect(
      getBorrowerProfile(borrowerProfile.email)
    ).resolves.toStrictEqual({
      dob: borrowerProfile.dob,
      email: borrowerProfile.email,
      creditScore: borrowerProfile.creditScore,
    });
  });
  it('resolves to undefined when the borrower does not exist', async () => {
    await putBorrowerProfile(borrowerProfile);
    await expect(
      getBorrowerProfile('fake@larphelp.net')
    ).resolves.toBeUndefined();
  });
});
