import { describe } from 'node:test';
import { runAdapterTestSuite, testAdapterCompliance } from '@rviscomi/capo.js/adapters/test-suite';
import { HtmlEslintAdapter } from '../../src/adapters/html-eslint-adapter.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const htmlParser = require('@html-eslint/parser');

import { RuleTester } from 'eslint';

describe('HtmlEslintAdapter', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser: htmlParser,
    },
  });

  runAdapterTestSuite(HtmlEslintAdapter, {
    createElement: (html) => {
      let capturedNode = null;
      ruleTester.run(
        'capture-node',
        {
          create(context) {
            return {
              'Tag, ScriptTag, StyleTag'(node) {
                if (!capturedNode) capturedNode = node;
              },
            };
          },
        },
        {
          valid: [html],
          invalid: [],
        }
      );
      return capturedNode;
    },
    supportsLocation: true,
  });

  testAdapterCompliance(HtmlEslintAdapter);
});
