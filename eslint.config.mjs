import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['.astro/**', 'dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  {
    rules: {
      'no-console': 'error',
    },
  },
]
