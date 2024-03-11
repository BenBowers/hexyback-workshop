import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { getYearsSinceCurrentDate } from './get-years-since-current-date';
describe('get-years-since-current-date', () => {
  describe('given the current date is 2024-03-15', () => {
    beforeAll(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2024, 2, 15));
    });
    afterAll(() => {
      vi.useRealTimers();
    });
    it('returns 0 when the date is 2024-03-15', () => {
      expect(getYearsSinceCurrentDate(new Date(2024, 2, 15))).toEqual(0);
    });
    it('returns 0 when the date is 2023-08-15', () => {
      expect(getYearsSinceCurrentDate(new Date(2023, 7, 15))).toEqual(0);
    });
    it('returns 1 when the date is 2023-03-15', () => {
      expect(getYearsSinceCurrentDate(new Date(2023, 2, 15))).toEqual(1);
    });
    it('returns 1 when the date is 2022-08-15', () => {
      expect(getYearsSinceCurrentDate(new Date(2022, 7, 15))).toEqual(1);
    });
    it('returns 21 when the date is 2002-08-15', () => {
      expect(getYearsSinceCurrentDate(new Date(2002, 7, 15))).toEqual(21);
    });
    it('returns 50 when the date is 1974-03-15', () => {
      expect(getYearsSinceCurrentDate(new Date(1974, 2, 15))).toEqual(50);
    });
  });
});
