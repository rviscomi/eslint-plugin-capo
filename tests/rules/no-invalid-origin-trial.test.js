/**
 * @fileoverview Tests for no-invalid-origin-trial rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-invalid-origin-trial.js';
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

// Real origin trial tokens with proper structure for testing
// These are minimal valid tokens generated for testing purposes

// Valid token that expires in 2030 for https://example.com
const FUTURE_TOKEN =
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQeyJvcmlnaW4iOiJodHRwczovL2V4YW1wbGUuY29tOjQ0MyIsImZlYXR1cmUiOiJUZXN0RmVhdHVyZSIsImV4cGlyeSI6MTg5MzQ1NjAwMH0=';

// Valid token for example.com with isSubdomain flag
const TOKEN_WITH_SUBDOMAIN_FLAG =
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjeyJvcmlnaW4iOiJodHRwczovL2V4YW1wbGUuY29tOjQ0MyIsImZlYXR1cmUiOiJUZXN0RmVhdHVyZSIsImV4cGlyeSI6MTg5MzQ1NjAwMCwiaXNTdWJkb21haW4iOnRydWV9';

// Expired token from 2020 for https://example.com
const EXPIRED_TOKEN =
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQeyJvcmlnaW4iOiJodHRwczovL2V4YW1wbGUuY29tOjQ0MyIsImZlYXR1cmUiOiJUZXN0RmVhdHVyZSIsImV4cGlyeSI6MTU3NzgzNjgwMH0=';

// Token for different origin (https://different.com)
const TOKEN_DIFFERENT_ORIGIN =
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSeyJvcmlnaW4iOiJodHRwczovL2RpZmZlcmVudC5jb206NDQzIiwiZmVhdHVyZSI6IlRlc3RGZWF0dXJlIiwiZXhwaXJ5IjoxODkzNDU2MDAwfQ==';

// Token for subdomain without isSubdomain flag
const TOKEN_SUBDOMAIN_NO_FLAG =
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABoeyJvcmlnaW4iOiJodHRwczovL3N1Yi5leGFtcGxlLmNvbTo0NDMiLCJmZWF0dXJlIjoiVGVzdEZlYXR1cmUiLCJleHBpcnkiOjE4OTM0NTYwMDAsImlzU3ViZG9tYWluIjpmYWxzZX0=';

// Token for subdomain with isSubdomain flag
const TOKEN_SUBDOMAIN_WITH_FLAG =
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABneyJvcmlnaW4iOiJodHRwczovL3N1Yi5leGFtcGxlLmNvbTo0NDMiLCJmZWF0dXJlIjoiVGVzdEZlYXR1cmUiLCJleHBpcnkiOjE4OTM0NTYwMDAsImlzU3ViZG9tYWluIjp0cnVlfQ==';

// Invalid/malformed token
const INVALID_TOKEN = 'not-a-valid-token';

ruleTester.run('no-invalid-origin-trial', rule, {
  valid: [
    {
      name: 'valid origin trial token with future expiry',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="${FUTURE_TOKEN}">
        </head>
      `,
    },
    {
      name: 'origin trial with case-insensitive http-equiv',
      code: dedent`
        <head>
          <meta http-equiv="Origin-Trial" content="${FUTURE_TOKEN}">
        </head>
      `,
    },
    {
      name: 'no origin trial meta tags',
      code: dedent`
        <head>
          <meta name="viewport" content="width=device-width">
        </head>
      `,
    },
    {
      name: 'valid token matching expected origin',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="${FUTURE_TOKEN}">
        </head>
      `,
      options: [{ origin: 'https://example.com' }],
    },
    {
      name: 'parent domain token with isSubdomain flag works on subdomain',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="${TOKEN_WITH_SUBDOMAIN_FLAG}">
        </head>
      `,
      options: [{ origin: 'https://sub.example.com' }],
    },
  ],

  invalid: [
    {
      name: 'origin trial without content attribute',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial">
        </head>
      `,
      output: dedent`
        <head>
          
        </head>
      `,
      errors: [
        {
          messageId: 'missingContent',
        },
      ],
    },
    {
      name: 'origin trial with empty token',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="">
        </head>
      `,
      output: dedent`
        <head>
          
        </head>
      `,
      errors: [
        {
          messageId: 'emptyToken',
        },
      ],
    },
    {
      name: 'origin trial with whitespace-only token',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="   ">
        </head>
      `,
      output: dedent`
        <head>
          
        </head>
      `,
      errors: [
        {
          messageId: 'emptyToken',
        },
      ],
    },
    {
      name: 'origin trial with invalid token format',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="${INVALID_TOKEN}">
        </head>
      `,
      output: dedent`
        <head>
          
        </head>
      `,
      errors: [
        {
          messageId: 'invalidToken',
        },
      ],
    },
    {
      name: 'origin trial with expired token',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="${EXPIRED_TOKEN}">
        </head>
      `,
      output: dedent`
        <head>
          
        </head>
      `,
      errors: [
        {
          messageId: 'expiredToken',
        },
      ],
    },
    {
      name: 'multiple origin trials with mixed validity',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="">
          <meta http-equiv="origin-trial" content="${EXPIRED_TOKEN}">
        </head>
      `,
      output: dedent`
        <head>
          
          
        </head>
      `,
      errors: [
        {
          messageId: 'emptyToken',
        },
        {
          messageId: 'expiredToken',
        },
      ],
    },
    {
      name: 'origin trial with malformed base64',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="!!!invalid-base64!!!">
        </head>
      `,
      output: dedent`
        <head>
          
        </head>
      `,
      errors: [
        {
          messageId: 'invalidToken',
        },
      ],
    },
    {
      name: 'origin trial token that is too short',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="short">
        </head>
      `,
      output: dedent`
        <head>
          
        </head>
      `,
      errors: [
        {
          messageId: 'invalidToken',
        },
      ],
    },
    {
      name: 'token with wrong origin when origin validation enabled',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="${TOKEN_DIFFERENT_ORIGIN}">
        </head>
      `,
      options: [{ origin: 'https://example.com' }],
      errors: [
        {
          messageId: 'invalidOrigin',
        },
      ],
    },
    {
      name: 'token for subdomain used on parent domain',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="${TOKEN_SUBDOMAIN_NO_FLAG}">
        </head>
      `,
      options: [{ origin: 'https://example.com' }],
      errors: [
        {
          messageId: 'invalidOrigin',
        },
      ],
    },
    {
      name: 'parent domain token without isSubdomain flag used on subdomain',
      code: dedent`
        <head>
          <meta http-equiv="origin-trial" content="${FUTURE_TOKEN}">
        </head>
      `,
      options: [{ origin: 'https://sub.example.com' }],
      errors: [
        {
          messageId: 'invalidSubdomain',
        },
      ],
    },
  ],
});

console.log('All no-invalid-origin-trial tests passed!');
