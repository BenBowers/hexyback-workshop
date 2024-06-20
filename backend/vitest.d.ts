import 'vitest';

interface CustomMatchers<R = unknown> {
  toBeNumber(): R;
  toFindDynamoDBItem({
    pollingIntervalSeconds: number,
    pollingTimeoutSeconds: number,
  }): Promise<R>;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
