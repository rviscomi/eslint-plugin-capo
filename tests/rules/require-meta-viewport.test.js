/**
 * @fileoverview Tests for require-meta-viewport rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/require-meta-viewport.js';
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

ruleTester.run('require-meta-viewport', rule, {
  valid: [
    {
      code: dedent`
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
      `,
    },
    {
      code: dedent`
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Page</title>
        </head>
      `,
    },
  ],

  invalid: [
    {
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>No Viewport</title>
        </head>
      `,
      errors: [
        {
          messageId: 'missingViewport',
        },
      ],
    },
  ],
});
