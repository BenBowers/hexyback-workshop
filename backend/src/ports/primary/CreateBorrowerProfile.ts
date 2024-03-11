import { BorrowerProfile } from '@/types/api';

export type CreateBorrowerProfileInput = {
  name: string;
  email: string;
  creditScore: number;
  dob: string;
};

export type CreateBorrowerProfilePort = (
  createBorrowerProfileInput: CreateBorrowerProfileInput
) => Promise<BorrowerProfile>;
