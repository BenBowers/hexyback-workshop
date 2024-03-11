export type PutBorroweProfileInput = {
  email: string;
  name: string;
  creditScore: number;
  dob: string;
};
export type PutBorrowerProfilePort = (
  putBorrowerProfileInput: PutBorroweProfileInput
) => Promise<void>;
