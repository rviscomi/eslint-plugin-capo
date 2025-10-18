/**
 * @fileoverview Tests for valid-charset rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import rule from "../../src/rules/valid-charset.js";
import parser from "@html-eslint/parser";
import dedent from "dedent";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
  },
});

ruleTester.run("valid-charset", rule, {
  valid: [
    {
      code: dedent`
        <head>
          <meta charset="utf-8">
        </head>
      `,
    },
    {
      code: dedent`
        <head>
          <meta charset="UTF-8">
        </head>
      `,
    },
    {
      code: dedent`
        <head>
          <title>No charset is ok for testing</title>
        </head>
      `,
    },
  ],

  invalid: [
    {
      code: dedent`
        <head>
          <meta charset="iso-8859-1">
        </head>
      `,
      errors: [
        {
          messageId: "invalidCharset",
          suggestions: [
            {
              messageId: "fixToUtf8",
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
      code: dedent`
        <head>
          <meta charset="windows-1252">
        </head>
      `,
      errors: [
        {
          messageId: "invalidCharset",
          suggestions: [
            {
              messageId: "fixToUtf8",
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
      code: '<head><meta charset="latin1"></head>',
      errors: [
        {
          messageId: "invalidCharset",
          suggestions: [
            {
              messageId: "fixToUtf8",
              output: '<head><meta charset="utf-8"></head>',
            },
          ],
        },
      ],
    },
  ],
});
