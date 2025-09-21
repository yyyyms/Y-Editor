/* eslint-disable no-dupe-keys */
import antfu from '@antfu/eslint-config';

export default antfu(
  {
    react: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },
    formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
      css: true,
      /**
       * Format HTML files
       * By default uses Prettier
       */
      html: true,
      /**
       * Format Markdown files
       * Supports Prettier and dprint
       * By default uses Prettier
       */
      markdown: 'prettier',
      react: true,
    },
    rules: {
      'prefer-destructuring': ['warn', { object: true, array: false }],
      'no-else-return': ['error', { allowElseIf: false }],
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'react/display-name': 'off',
      'prefer-promise-reject-errors': 'off',
      'react/no-unescaped-entities': 'off',
      'curly': ['error', 'all'], // 单行允许花括号
      'ts/no-explicit-any': 'error', // 不允许any
      'style/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        multilineDetection: 'brackets',
      }],
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'unknown'],
          'pathGroups': [
            {
              pattern: '{@,@api,@assets,@components,@const,@helpers,@i18n,@modules,@pages,@services,@store,@types,@utils,@style}/**',
              group: 'internal',
              position: 'before',
            },
          ],
          'pathGroupsExcludedImportTypes': [],
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
          'warnOnUnassignedImports': false,
          'newlines-between': 'always',
        },
      ],
      'style/brace-style': ['error', '1tbs'],
      'react/prop-types': 'off',
    },
  },
  {
    // .eslintignore no longer works in Flat config
    ignores: [
      'public',
      'node_modules',
      'dist',
      'build',
      'src/modules/BabelWorker/package/worker.iife.js',
      'src/i18n/locales',
      'src/helpers/lottie',
    ],
  },
);
