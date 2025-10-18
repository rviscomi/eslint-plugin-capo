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
      name: 'viewport with width and initial-scale',
      code: dedent`
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
      `,
    },
    {
      name: 'viewport with only width',
      code: dedent`
        <head>
          <meta name="viewport" content="width=device-width">
        </head>
      `,
    },
    {
      name: 'viewport with minimum-scale allowed',
      code: dedent`
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.5">
        </head>
      `,
    },
  ],

  invalid: [
    {
      name: 'user-scalable=no only',
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
      name: 'user-scalable=0 with width',
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
      name: 'maximum-scale=1 only',
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
      name: 'maximum-scale=1.5 with width',
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
      name: 'both user-scalable=no and maximum-scale=1',
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
