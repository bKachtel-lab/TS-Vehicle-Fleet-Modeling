import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  // Ignored files (remplace .eslintignore)
  {
    ignores: ['node_modules/**', 'coverage/**', 'dist/**', 'eslint.config.js'],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // App code
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      'no-console': 'off',
      strict: ['error', 'global'],
      curly: 'warn',
      semi: 'warn',
      'no-unused-vars': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // Vitest files
  {
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
  },
];
