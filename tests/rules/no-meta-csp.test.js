/**
 * @fileoverview Tests for no-meta-csp rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-meta-csp.js';
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

ruleTester.run('no-meta-csp', rule, {
  valid: [
    {
      name: 'no CSP meta tags',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>No CSP</title>
        </head>
      `,
    },
    {
      name: 'different http-equiv value',
      code: dedent`
        <head>
          <meta http-equiv="refresh" content="5">
        </head>
      `,
    },
  ],

  invalid: [
    {
      name: 'Content-Security-Policy with mixed case',
      code: dedent`
        <head>
          <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
        </head>
      `,
      errors: [
        {
          messageId: 'metaCSP',
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
      name: 'content-security-policy lowercase',
      code: dedent`
        <head>
          <meta http-equiv="content-security-policy" content="script-src 'none'">
        </head>
      `,
      errors: [
        {
          messageId: 'metaCSP',
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
      name: 'Content-Security-Policy-Report-Only',
      code: dedent`
        <head>
          <meta http-equiv="Content-Security-Policy-Report-Only" content="default-src 'self'">
        </head>
      `,
      errors: [
        {
          messageId: 'metaCSP',
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
