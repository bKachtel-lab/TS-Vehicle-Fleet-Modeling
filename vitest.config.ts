import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from 'vitest/config';

export default defineConfig({
  test: {
    include: [...configDefaults.include, 'src/**/*.test.ts'],
    exclude: [...configDefaults.exclude, 'build/**/*'],
    coverage: {
      provider: 'v8',
      exclude: [...coverageConfigDefaults.exclude, 'build/**/*'],
    },
  },
});
