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
});

ruleTester.run('no-duplicate-base', rule, {
  valid: [
    {
      code: dedent`
        <head>
          <base href="/">
          <title>Page</title>
        </head>
      `,
    },
    {
      code: dedent`
        <head>
          <title>No base element</title>
        </head>
      `,
    },
  ],

  invalid: [
    {
      code: dedent`
        <head>
          <base href="/">
          <base href="/about/">
        </head>
      `,
      errors: [
        {
          messageId: 'duplicateBase',
          data: {
            count: 2,
          },
          suggestions: [
            {
              messageId: 'removeDuplicate',
              output: dedent`
                <head>
                  <base href="/">
                </head>
              `,
            },
          ],
        },
      ],
    },
    {
      code: dedent`
        <head>
          <base href="/">
          <title>Page</title>
          <base href="/blog/">
          <base target="_blank">
        </head>
      `,
      errors: [
        {
          messageId: 'duplicateBase',
          data: {
            count: 2,
          },
          suggestions: [
            {
              messageId: 'removeDuplicate',
              output: dedent`
                <head>
                  <base href="/">
                  <title>Page</title>
                  <base target="_blank">
                </head>
              `,
            },
          ],
        },
        {
          messageId: 'duplicateBase',
          data: {
            count: 3,
          },
          suggestions: [
            {
              messageId: 'removeDuplicate',
              output: dedent`
                <head>
                  <base href="/">
                  <title>Page</title>
                  <base href="/blog/">
                </head>
              `,
            },
          ],
        },
      ],
    },
  ],
});
