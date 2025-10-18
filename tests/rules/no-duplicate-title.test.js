/**
 * @fileoverview Tests for no-duplicate-title rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-duplicate-title.js';
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

ruleTester.run('no-duplicate-title', rule, {
  valid: [
    {
      name: 'single title element',
      code: dedent`
        <head>
          <title>My Page</title>
        </head>
      `,
    },
    {
      name: 'single title with other elements',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>Valid Title</title>
          <meta name="viewport" content="width=device-width">
        </head>
      `,
    },
    {
      name: 'no title element',
      code: dedent`
        <head>
          <meta charset="utf-8">
        </head>
      `,
      // No title is OK for this rule - that's handled by require-title
    },
  ],

  invalid: [
    {
      name: 'two duplicate title elements',
      code: dedent`
        <head>
          <title>First Title</title>
          <title>Second Title</title>
        </head>
      `,
      errors: [
        {
          messageId: 'duplicateTitle',
          suggestions: [
            {
              messageId: 'removeDuplicateTitle',
              output: dedent`
                <head>
                  <title>First Title</title>
                </head>
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'three duplicate title elements',
      code: dedent`
        <head>
          <title>First</title>
          <meta charset="utf-8">
          <title>Second</title>
          <title>Third</title>
        </head>
      `,
      errors: [
        {
          messageId: 'duplicateTitle',
          suggestions: [
            {
              messageId: 'removeDuplicateTitle',
              output: dedent`
                <head>
                  <title>First</title>
                  <meta charset="utf-8">
                  <title>Third</title>
                </head>
              `,
            },
          ],
        },
        {
          messageId: 'duplicateTitle',
          suggestions: [
            {
              messageId: 'removeDuplicateTitle',
              output: dedent`
                <head>
                  <title>First</title>
                  <meta charset="utf-8">
                  <title>Second</title>
                </head>
              `,
            },
          ],
        },
      ],
    },
  ],
});
