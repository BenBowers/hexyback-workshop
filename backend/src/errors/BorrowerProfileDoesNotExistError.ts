export class BorrowerProfileDoesNotExistError extends Error {
  constructor(message: string) {
    super(message);
    this.type = 'BorrowerProfileDoesNotExistError';
  }
  type: string;
}
