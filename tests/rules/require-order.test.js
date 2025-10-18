/**
 * @fileoverview Tests for require-order rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/require-order.js';
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

ruleTester.run('require-order', rule, {
  valid: [
    {
      name: 'optimal order with all element types',
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
      name: 'simple page with only meta and title',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>Simple Page</title>
        </head>
      `,
    },
    {
      name: 'viewport meta before title',
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
      errors: [
        {
          messageId: 'wrongOrder',
          data: {
            current: 'DEFER_SCRIPT',
            currentWeight: '3',
            next: 'PRECONNECT',
            nextWeight: '9',
          },
        },
      ],
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
      errors: [
        {
          messageId: 'wrongOrder',
          data: {
            current: 'PREFETCH_PRERENDER',
            currentWeight: '2',
            next: 'ASYNC_SCRIPT',
            nextWeight: '8',
          },
        },
        {
          messageId: 'wrongOrder',
          data: {
            current: 'ASYNC_SCRIPT',
            currentWeight: '8',
            next: 'META',
            nextWeight: '11',
          },
        },
      ],
    },
    {
      name: 'preload before async script',
      code: dedent`
        <head>
          <link rel="preload" href="font.woff2" as="font">
          <script async src="analytics.js"></script>
        </head>
      `,
      errors: [
        {
          messageId: 'wrongOrder',
          data: {
            current: 'PRELOAD',
            currentWeight: '4',
            next: 'ASYNC_SCRIPT',
            nextWeight: '8',
          },
        },
      ],
    },
    {
      name: 'module script before preconnect',
      code: dedent`
        <head>
          <script type="module" src="module.js"></script>
          <link rel="preconnect" href="https://example.com">
        </head>
      `,
      errors: [
        {
          messageId: 'wrongOrder',
          data: {
            current: 'DEFER_SCRIPT',
            currentWeight: '3',
            next: 'PRECONNECT',
            nextWeight: '9',
          },
        },
      ],
    },
    {
      name: 'inline script before meta',
      code: dedent`
        <head>
          <script>console.log('inline');</script>
          <meta charset="utf-8">
        </head>
      `,
      errors: [
        {
          messageId: 'wrongOrder',
          data: {
            current: 'SYNC_SCRIPT',
            currentWeight: '6',
            next: 'META',
            nextWeight: '11',
          },
        },
      ],
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
      errors: [
        {
          messageId: 'wrongOrder',
          data: {
            current: 'DEFER_SCRIPT',
            currentWeight: '3',
            next: 'META',
            nextWeight: '11',
          },
        },
      ],
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
      errors: [
        {
          messageId: 'wrongOrder',
          data: {
            current: 'SYNC_STYLES',
            currentWeight: '5',
            next: 'TITLE',
            nextWeight: '10',
          },
        },
        {
          messageId: 'wrongOrder',
          data: {
            current: 'TITLE',
            currentWeight: '10',
            next: 'META',
            nextWeight: '11',
          },
        },
        {
          messageId: 'wrongOrder',
          data: {
            current: 'ASYNC_SCRIPT',
            currentWeight: '8',
            next: 'META',
            nextWeight: '11',
          },
        },
      ],
    },
  ],
});
