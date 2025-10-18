/**
 * @fileoverview Tests for no-invalid-http-equiv rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-invalid-http-equiv.js';
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

ruleTester.run('no-invalid-http-equiv', rule, {
  valid: [
    {
      name: 'valid content-security-policy',
      code: dedent`
        <head>
          <meta http-equiv="content-security-policy" content="default-src 'self'">
        </head>
      `,
    },
    {
      name: 'valid content-type',
      code: dedent`
        <head>
          <meta http-equiv="content-type" content="text/html; charset=utf-8">
        </head>
      `,
    },
    {
      name: 'valid default-style',
      code: dedent`
        <head>
          <meta http-equiv="default-style" content="preferred">
        </head>
      `,
    },
    {
      name: 'valid origin-trial',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="token123">
        </head>
      `,
    },
  ],

  invalid: [
    {
      name: 'invalid imagetoolbar',
      code: dedent`
        <head>
          <meta http-equiv="imagetoolbar" content="no">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidHttpEquiv',
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
      name: 'invalid description',
      code: dedent`
        <head>
          <meta http-equiv="description" content="My page">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidHttpEquiv',
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
      name: 'invalid keywords',
      code: dedent`
        <head>
          <meta http-equiv="keywords" content="html, meta">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidHttpEquiv',
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
      name: 'invalid X-UA-Compatible',
      code: dedent`
        <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidHttpEquiv',
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
