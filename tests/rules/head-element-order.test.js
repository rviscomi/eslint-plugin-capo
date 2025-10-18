/**
 * @fileoverview Tests for head-element-order rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/head-element-order.js';
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

ruleTester.run('head-element-order', rule, {
  valid: [
    {
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>Optimal Order</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <script async src="analytics.js"></script>
          <script src="app.js"></script>
          <link rel="stylesheet" href="styles.css">
          <style>body { margin: 0; }</style>
          <link rel="preload" href="font.woff2" as="font">
          <script defer src="defer.js"></script>
          <link rel="prefetch" href="next.html">
        </head>
      `,
    },
    {
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>Simple Page</title>
        </head>
      `,
    },
    {
      code: dedent`
        <head>
          <meta name="viewport" content="width=device-width">
          <title>Title</title>
        </head>
      `,
    },
  ],

  invalid: [
    {
      name: 'title before meta',
      code: dedent`
        <head>
          <title>Title First</title>
          <meta charset="utf-8">
        </head>
      `,
      errors: [
        {
          messageId: 'wrongOrder',
          data: {
            current: 'TITLE',
            currentWeight: '10',
            next: 'META',
            nextWeight: '11',
          },
        },
      ],
    },
    {
      name: 'defer script before preconnect',
      code: dedent`
        <head>
          <script defer src="app.js"></script>
          <link rel="preconnect" href="https://api.example.com">
        </head>
      `,
      errors: 1,
    },
    {
      name: 'prefetch before async script before meta',
      code: dedent`
        <head>
          <link rel="prefetch" href="next.html">
          <script async src="analytics.js"></script>
          <meta charset="utf-8">
        </head>
      `,
      errors: 2,
    },
    {
      name: 'preload before async script',
      code: dedent`
        <head>
          <link rel="preload" href="font.woff2" as="font">
          <script async src="analytics.js"></script>
        </head>
      `,
      errors: 1,
    },
    {
      name: 'module script before preconnect',
      code: dedent`
        <head>
          <script type="module" src="module.js"></script>
          <link rel="preconnect" href="https://example.com">
        </head>
      `,
      errors: 1,
    },
    {
      name: 'inline script before meta',
      code: dedent`
        <head>
          <script>console.log('inline');</script>
          <meta charset="utf-8">
        </head>
      `,
      errors: 1,
    },
    {
      name: 'complex head with multiple issues',
      code: dedent`
        <head>
          <base href="/">
          <title>Page</title>
          <script defer src="app.js"></script>
          <meta name="viewport" content="width=device-width">
          <link rel="stylesheet" href="styles.css">
        </head>
      `,
      errors: 1, // defer before meta
    },
    {
      name: 'very complex head with many issues',
      code: dedent`
        <head>
          <link rel="stylesheet" href="1.css">
          <title>Late Title</title>
          <meta name="viewport" content="width=device-width">
          <script async src="async.js"></script>
          <meta charset="utf-8">
          <link rel="preconnect" href="https://example.com">
        </head>
      `,
      errors: 3, // Checking actual count
    },
  ],
});
