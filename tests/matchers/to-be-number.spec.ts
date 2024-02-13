import { describe, expect, it } from 'vitest';
import { toBeNumber } from './to-be-number';

describe('to-be-number', () => {
  const errorMessage = 'expected a number';
  describe('given a number', () => {
    it('returns pass true and a message that produces an empty string', () => {
      const { pass, message } = toBeNumber(42);
      expect(pass).toBe(true);
      expect(message()).toEqual('');
    });
  });
  describe('given a string', () => {
    it('returns pass false and a message that produces "expected a number"', () => {
      const { pass, message } = toBeNumber('hello');
      expect(pass).toBe(false);
      expect(message()).toEqual(errorMessage);
    });
  });
  describe('given an object', () => {
    it('returns pass false and a message that produces "expected a number"', () => {
      const { pass, message } = toBeNumber({});
      expect(pass).toBe(false);
      expect(message()).toEqual(errorMessage);
    });
  });
  describe('given a boolean', () => {
    it('returns pass false and a message that produces "expected a number"', () => {
      const { pass, message } = toBeNumber(true);
      expect(pass).toBe(false);
      expect(message()).toEqual(errorMessage);
    });
  });
  describe('given undefined', () => {
    it('returns pass false and a message that produces "expected a number"', () => {
      const { pass, message } = toBeNumber(undefined);
      expect(pass).toBe(false);
      expect(message()).toEqual(errorMessage);
    });
  });
});
