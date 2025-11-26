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
  settings: {
    capo: {
      rules: ['no-invalid-origin-trial'],
    },
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
      code: `
        <html>
          <head>
            <meta http-equiv="origin-trial" content="${FUTURE_TOKEN}">
            <meta http-equiv="origin-trial" content="${TOKEN_WITH_SUBDOMAIN_FLAG}">
          </head>
        </html>
      `,
    },
  ],
  invalid: [
    {
      code: `
        <html>
          <head>
            <meta http-equiv="origin-trial" content="${INVALID_TOKEN}">
            <meta http-equiv="origin-trial" content="${EXPIRED_TOKEN}">
          </head>
        </html>
      `,
      errors: [{ messageId: 'invalidOriginTrial' }, { messageId: 'invalidOriginTrial' }],
      output: `
        <html>
          <head>
            <meta http-equiv="origin-trial" content="${EXPIRED_TOKEN}">
          </head>
        </html>
      `,
    },
    {
      code: `
        <html>
          <head>
            <meta http-equiv="origin-trial" content="${INVALID_TOKEN}">
          </head>
        </html>
      `,
      errors: [{ messageId: 'invalidOriginTrial' }],
      output: `
        <html>
          <head>
          </head>
        </html>
      `,
    },
  ],
});

console.log('All no-invalid-origin-trial tests passed!');
