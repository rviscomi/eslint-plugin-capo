/**
 * @fileoverview Tests for valid-charset rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-charset.js';
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

ruleTester.run('valid-charset', rule, {
  valid: [
    {
      name: 'lowercase utf-8',
      code: dedent`
        <head>
          <meta charset="utf-8">
        </head>
      `,
    },
    {
      name: 'uppercase UTF-8',
      code: dedent`
        <head>
          <meta charset="UTF-8">
        </head>
      `,
    },
    {
      name: 'no charset meta (not enforced by this rule)',
      code: dedent`
        <head>
          <title>No charset is ok for testing</title>
        </head>
      `,
    },
  ],

  invalid: [
    {
      name: 'iso-8859-1 charset',
      code: dedent`
        <head>
          <meta charset="iso-8859-1">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidCharset',
          suggestions: [
            {
              messageId: 'fixToUtf8',
              output: dedent`
                <head>
                  <meta charset="utf-8">
                </head>
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'windows-1252 charset',
      code: dedent`
        <head>
          <meta charset="windows-1252">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidCharset',
          suggestions: [
            {
              messageId: 'fixToUtf8',
              output: dedent`
                <head>
                  <meta charset="utf-8">
                </head>
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'latin1 charset',
      code: '<head><meta charset="latin1"></head>',
      errors: [
        {
          messageId: 'invalidCharset',
          suggestions: [
            {
              messageId: 'fixToUtf8',
              output: '<head><meta charset="utf-8"></head>',
            },
          ],
        },
      ],
    },
    {
      name: 'duplicate charset declarations',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <meta charset="utf-8">
        </head>
      `,
      errors: [
        {
          messageId: 'duplicateCharset',
        },
      ],
    },
    {
      name: 'duplicate charset - second one is invalid',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <meta charset="iso-8859-1">
        </head>
      `,
      errors: [
        {
          messageId: 'duplicateCharset',
        },
      ],
    },
  ],
});
