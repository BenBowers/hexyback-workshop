export const getYearsSinceCurrentDate = (date: Date): number =>
  new Date(new Date().valueOf() - date.valueOf()).getFullYear() - 1970;
