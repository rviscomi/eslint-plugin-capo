import capo from 'eslint-plugin-capo';
import htmlParser from '@html-eslint/parser';

export default [
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: htmlParser,
    },
    plugins: {
      capo,
    },
    rules: {
      ...capo.configs.strict.rules,
    },
  },
];
