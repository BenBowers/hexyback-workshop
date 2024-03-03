import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    setupFiles: ['vitest-setup'],
    globals: true,
    include: ['tests/integration/**/*.spec.ts'],
    testTimeout: 30000,
  },
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },
  plugins: [tsconfigPaths()],
});
