import { describe, expect, it, vi } from 'vitest';
import { isUserAuthorized } from './is-user-authorized';

describe('is-user-authorized', () => {
  vi.mock('sst/node/config', () => ({
    Config: {
      API_KEY: 'abc',
    },
  }));
  describe('given the authorization token is equal to the API_KEY', () => {
    it('returns true', () => {
      expect(isUserAuthorized('abc')).toBe(true);
    });
  });
  describe('given the authorization token is not equal to the API_KEY', () => {
    it('returns true', () => {
      expect(isUserAuthorized('invalid')).toBe(false);
    });
  });
});
