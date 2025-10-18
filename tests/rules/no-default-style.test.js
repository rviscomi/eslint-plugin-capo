/**
 * @fileoverview Tests for no-default-style rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import rule from "../../src/rules/no-default-style.js";
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

ruleTester.run("no-default-style", rule, {
  valid: [
    {
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>No default-style</title>
        </head>
      `,
    },
    {
      code: dedent`
        <head>
          <meta http-equiv="refresh" content="5">
        </head>
      `,
    },
  ],

  invalid: [
    {
      code: dedent`
        <head>
          <meta http-equiv="default-style" content="my-style">
        </head>
      `,
      errors: [
        {
          messageId: "noDefaultStyle",
        },
      ],
    },
    {
      code: dedent`
        <head>
          <meta http-equiv="Default-Style" content="theme">
        </head>
      `,
      errors: [
        {
          messageId: "noDefaultStyle",
        },
      ],
    },
  ],
});
