const calculateDebtToIncomeRatio = (
  monthlyExpenses: number,
  grossAnnualIncome: number
) => monthlyExpenses / (grossAnnualIncome / 12);
export default calculateDebtToIncomeRatio;
