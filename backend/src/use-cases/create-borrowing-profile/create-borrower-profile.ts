import { getBorrowerProfile } from '@/adaptors/secondary/ddb-get-borrower-profile';
import { putBorrowerProfile } from '@/adaptors/secondary/ddb-put-borrower-profile';
import { BorrowerProfileAlreadyExistsError } from '@/errors/BorrowerProfileAlreadyExistsError';
import { CreateBorrowerProfilePort } from '@/ports/primary/CreateBorrowerProfile';
import { BorrowerProfile } from '@/types/api';
export const createBorrowerProfile: CreateBorrowerProfilePort = async (
  borrowerProfile: BorrowerProfile
): Promise<BorrowerProfile> => {
  const getBorrowerProfileResult = await getBorrowerProfile(
    borrowerProfile.email
  );
  if (getBorrowerProfileResult) {
    throw new BorrowerProfileAlreadyExistsError(
      'Borrower profile already exists.'
    );
  }
  await putBorrowerProfile(borrowerProfile);
  return borrowerProfile;
};
