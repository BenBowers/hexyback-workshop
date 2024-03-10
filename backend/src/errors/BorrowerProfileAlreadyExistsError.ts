export class BorrowerProfileAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.type = 'BorrowingProfileAlreadyExistsError';
  }
  type: string;
}
