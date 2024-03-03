export const toBeNumber = (received: unknown) => {
  if (!(typeof received === 'number')) {
    return {
      message: () => 'expected a number',
      pass: false,
    };
  }
  return {
    message: () => '',
    pass: true,
  };
};
