export class InternalError extends Error {
  constructor(message: string) {
    super(message);
    this.type = 'InternalError';
  }
  type: string;
}
