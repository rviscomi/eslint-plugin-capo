/**
 * @fileoverview Tests for no-duplicate-base rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-duplicate-base.js';
import parser from '@html-eslint/parser';
import dedent from 'dedent';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
  },
  settings: {
    capo: {
      rules: ['no-duplicate-base'],
    },
  },
});

ruleTester.run('no-duplicate-base', rule, {
  valid: [
    {
      name: 'single base element',
      code: dedent`
        <head>
          <base href="/">
          <title>Page</title>
        </head>
      `,
    },
    {
      name: 'no base element',
      code: dedent`
        <head>
          <title>No base element</title>
        </head>
      `,
    },
  ],

  invalid: [
    {
      name: 'two duplicate base elements',
      code: dedent`
        <head>
          <base href="https://example.com/page.html" />
          <base href="https://example.com/page.html" />
        </head>
      `,
      errors: [
        {
          messageId: 'duplicateBase',
          suggestions: [
            {
              messageId: 'removeDuplicateBase',
              output: dedent`
                <head>
                  <base href="https://example.com/page.html" />
                </head>
              `,
            },
          ],
        },
        {
          messageId: 'duplicateBase',
          suggestions: [
            {
              messageId: 'removeDuplicateBase',
              output: dedent`
                <head>
                  <base href="https://example.com/page.html" />
                </head>
              `,
            },
          ],
        },
      ],
    },
  ],
});
