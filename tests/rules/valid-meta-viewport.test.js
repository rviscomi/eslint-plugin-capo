/**
 * @fileoverview Tests for valid-meta-viewport rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-meta-viewport.js';
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

ruleTester.run('valid-meta-viewport', rule, {
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
          <meta name="viewport" content="width=device-width">
        </head>
      `,
    },
    {
      code: dedent`
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.5">
        </head>
      `,
    },
  ],

  invalid: [
    {
      code: dedent`
        <head>
          <meta name="viewport" content="user-scalable=no">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidViewport',
          suggestions: [
            {
              messageId: 'removeUserScalable',
              output: dedent`
                <head>
                  <meta name="viewport" content="">
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
          <meta name="viewport" content="width=device-width, user-scalable=0">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidViewport',
          suggestions: [
            {
              messageId: 'removeUserScalable',
              output: dedent`
                <head>
                  <meta name="viewport" content="width=device-width">
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
          <meta name="viewport" content="maximum-scale=1">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidViewport',
          suggestions: [
            {
              messageId: 'removeMaximumScale',
              output: dedent`
                <head>
                  <meta name="viewport" content="">
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
          <meta name="viewport" content="width=device-width, maximum-scale=1.5">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidViewport',
          suggestions: [
            {
              messageId: 'removeMaximumScale',
              output: dedent`
                <head>
                  <meta name="viewport" content="width=device-width">
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
          <meta name="viewport" content="user-scalable=no, maximum-scale=1">
        </head>
      `,
      errors: [
        {
          messageId: 'invalidViewport',
          suggestions: [
            {
              messageId: 'removeUserScalable',
              output: dedent`
                <head>
                  <meta name="viewport" content="maximum-scale=1">
                </head>
              `,
            },
            {
              messageId: 'removeMaximumScale',
              output: dedent`
                <head>
                  <meta name="viewport" content="user-scalable=no">
                </head>
              `,
            },
          ],
        },
        {
          messageId: 'invalidViewport',
          suggestions: [
            {
              messageId: 'removeUserScalable',
              output: dedent`
                <head>
                  <meta name="viewport" content="maximum-scale=1">
                </head>
              `,
            },
            {
              messageId: 'removeMaximumScale',
              output: dedent`
                <head>
                  <meta name="viewport" content="user-scalable=no">
                </head>
              `,
            },
          ],
        },
      ],
    },
  ],
});
