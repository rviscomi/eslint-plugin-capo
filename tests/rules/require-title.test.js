/**
 * @fileoverview Tests for require-title rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/require-title.js';
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

ruleTester.run('require-title', rule, {
  valid: [
    {
      name: 'head with title element',
      code: dedent`
        <head>
          <title>My Page</title>
        </head>
      `,
    },
    {
      name: 'title with other elements',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>Valid Title</title>
          <meta name="viewport" content="width=device-width">
        </head>
      `,
    },
    {
      name: 'multiple titles (handled by no-duplicate-title)',
      code: dedent`
        <head>
          <title>First Title</title>
          <title>Second Title</title>
        </head>
      `,
      // Multiple titles are OK for this rule - that's handled by no-duplicate-title
    },
  ],

  invalid: [
    {
      name: 'head without title element',
      code: dedent`
        <head>
          <meta charset="utf-8">
        </head>
      `,
      errors: [
        {
          messageId: 'missingTitle',
        },
      ],
    },
  ],
});
