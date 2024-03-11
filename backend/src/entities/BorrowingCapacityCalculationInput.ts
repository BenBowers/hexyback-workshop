export type BorrowingCapacityCalculationInput = {
  age: number;
  employmentStatus: 'FULL_TIME' | 'PART_TIME' | 'CASUAL' | 'SELF_EMPLOYED';
  grossAnnualIncome: number;
};
