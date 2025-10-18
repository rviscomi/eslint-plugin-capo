/**
 * @fileoverview Tests for no-invalid-head-elements rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import rule from "../../src/rules/no-invalid-head-elements.js";
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

ruleTester.run("no-invalid-head-elements", rule, {
  valid: [
    {
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>Valid Page</title>
          <link rel="stylesheet" href="styles.css">
        </head>
      `,
    },
    {
      code: dedent`
        <head>
          <meta name="description" content="A valid page">
          <script src="app.js"></script>
          <style>body { margin: 0; }</style>
        </head>
      `,
    },
    {
      code: dedent`
        <head>
          <base href="/">
          <noscript><link rel="stylesheet" href="fallback.css"></noscript>
        </head>
      `,
    },
  ],

  invalid: [
    {
      code: dedent`
        <head>
          <div>Invalid element</div>
        </head>
      `,
      errors: [
        {
          messageId: "invalidElement",
          data: {
            tagName: "div",
          },
          suggestions: [
            {
              messageId: "removeElement",
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
      code: dedent`
        <head>
          <meta charset="utf-8">
          <span>Not allowed</span>
        </head>
      `,
      errors: [
        {
          messageId: "invalidElement",
          data: {
            tagName: "span",
          },
          suggestions: [
            {
              messageId: "removeElement",
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
          <title>Page</title>
          <p>Paragraph</p>
          <button>Click</button>
        </head>
      `,
      errors: [
        {
          messageId: "invalidElement",
          data: {
            tagName: "p",
          },
          suggestions: [
            {
              messageId: "removeElement",
              output: dedent`
                <head>
                  <title>Page</title>
                  <button>Click</button>
                </head>
              `,
            },
          ],
        },
        {
          messageId: "invalidElement",
          data: {
            tagName: "button",
          },
          suggestions: [
            {
              messageId: "removeElement",
              output: dedent`
                <head>
                  <title>Page</title>
                  <p>Paragraph</p>
                </head>
              `,
            },
          ],
        },
      ],
    },
    {
      code: "<head><img src=\"logo.png\"></head>",
      errors: [
        {
          messageId: "invalidElement",
          data: {
            tagName: "img",
          },
          suggestions: [
            {
              messageId: "removeElement",
              output: "</head>",
            },
          ],
        },
      ],
    },
  ],
});
