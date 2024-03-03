import { expect } from 'vitest';
import { toBeNumber } from './tests/matchers/to-be-number';
expect.extend({
  toBeNumber,
});
