import { BorrowerProfile } from '@/entities/BorrowerProfile';

export type GetBorrowerProfilePort = (
  borrowerEmail: string
) => Promise<BorrowerProfile | undefined>;
