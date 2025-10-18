/**
 * @fileoverview Tests for no-default-style rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-default-style.js';
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

ruleTester.run('no-default-style', rule, {
  valid: [
    {
      name: 'no http-equiv meta tags',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>No default-style</title>
        </head>
      `,
    },
    {
      name: 'http-equiv with different value',
      code: dedent`
        <head>
          <meta http-equiv="refresh" content="5">
        </head>
      `,
    },
  ],

  invalid: [
    {
      name: 'http-equiv with default-style lowercase',
      code: dedent`
        <head>
          <meta http-equiv="default-style" content="my-style">
        </head>
      `,
      errors: [
        {
          messageId: 'noDefaultStyle',
          suggestions: [
            {
              messageId: 'removeTag',
              output: dedent`
                <head>
                  
                </head>
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'http-equiv with Default-Style mixed case',
      code: dedent`
        <head>
          <meta http-equiv="Default-Style" content="theme">
        </head>
      `,
      errors: [
        {
          messageId: 'noDefaultStyle',
          suggestions: [
            {
              messageId: 'removeTag',
              output: dedent`
                <head>
                  
                </head>
              `,
            },
          ],
        },
      ],
    },
  ],
});
