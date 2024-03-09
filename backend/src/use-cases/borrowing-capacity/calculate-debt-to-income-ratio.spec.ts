import { describe, expect, it } from 'vitest';
import calculateDebtToIncomeRatio from './calculate-debt-to-income-ratio';
describe('calculate-debt-to-income-ratio', () => {
  describe('Given monthly expenses and gross annual income', () => {
    it('calculates the debt to income ratio as the ratio of monthly expenses to the prorated monthly gross income', () => {
      const monthlyExpenses = 5000;
      const grossAnnualIncome = 120000;
      const actualDebtToIncomeRatio = calculateDebtToIncomeRatio(
        monthlyExpenses,
        grossAnnualIncome
      );
      const expectedDebtToIncomeRatio = 0.5;
      expect(actualDebtToIncomeRatio).toBeCloseTo(expectedDebtToIncomeRatio);
    });
  });
});
