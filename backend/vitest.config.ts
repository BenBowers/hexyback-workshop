/// <reference types="vitest" />
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: [
      'src/**/*.spec.ts',
      'infra/custom-resources/**/*.spec.ts',
      'tests/matchers/**/*.spec.ts',
    ],
    testTimeout: 30000,
  },
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },
  plugins: [tsconfigPaths()],
});
