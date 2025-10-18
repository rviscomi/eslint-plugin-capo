/**
 * @fileoverview Tests for no-unnecessary-preload rule
 * @author Rick Viscomi
 */

//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-unnecessary-preload.js';
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

ruleTester.run('no-unnecessary-preload', rule, {
  valid: [
    {
      name: 'no preload links',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>No Preload</title>
          <script src="/app.js"></script>
        </head>
      `,
    },
    {
      name: 'preload for font (not discoverable early)',
      code: dedent`
        <head>
          <link rel="preload" href="/font.woff2" as="font" crossorigin>
          <link rel="stylesheet" href="/styles.css">
        </head>
      `,
    },
    {
      name: 'preload for late-discovered resource',
      code: dedent`
        <head>
          <link rel="preload" href="/hero-image.jpg" as="image">
          <script src="/app.js"></script>
        </head>
      `,
    },
    {
      name: 'preload with different URL than script',
      code: dedent`
        <head>
          <link rel="preload" href="/lib.js" as="script">
          <script src="/app.js"></script>
        </head>
      `,
    },
    {
      name: 'modulepreload for module not yet loaded',
      code: dedent`
        <head>
          <link rel="modulepreload" href="/utils.js">
          <script src="/app.js" type="module"></script>
        </head>
      `,
    },
    {
      name: 'preload without href attribute',
      code: dedent`
        <head>
          <link rel="preload" as="script">
        </head>
      `,
    },
  ],

  invalid: [
    {
      name: 'preload for script already in head',
      code: dedent`
        <head>
          <link rel="preload" href="/app.js" as="script">
          <script src="/app.js"></script>
        </head>
      `,
      errors: [
        {
          messageId: 'unnecessaryPreload',
          data: {
            href: '/app.js',
            tagName: 'script',
          },
        },
      ],
    },
    {
      name: 'preload for stylesheet already in head',
      code: dedent`
        <head>
          <link rel="preload" href="/styles.css" as="style">
          <link rel="stylesheet" href="/styles.css">
        </head>
      `,
      errors: [
        {
          messageId: 'unnecessaryPreload',
          data: {
            href: '/styles.css',
            tagName: 'link',
          },
        },
      ],
    },
    {
      name: 'modulepreload for module script already in head',
      code: dedent`
        <head>
          <link rel="modulepreload" href="/app.js">
          <script src="/app.js" type="module"></script>
        </head>
      `,
      errors: [
        {
          messageId: 'unnecessaryPreload',
          data: {
            href: '/app.js',
            tagName: 'script',
          },
        },
      ],
    },
    {
      name: 'preload after script (still unnecessary)',
      code: dedent`
        <head>
          <script src="/app.js"></script>
          <link rel="preload" href="/app.js" as="script">
        </head>
      `,
      errors: [
        {
          messageId: 'unnecessaryPreload',
          data: {
            href: '/app.js',
            tagName: 'script',
          },
        },
      ],
    },
    {
      name: 'multiple unnecessary preloads',
      code: dedent`
        <head>
          <link rel="preload" href="/app.js" as="script">
          <link rel="preload" href="/styles.css" as="style">
          <script src="/app.js"></script>
          <link rel="stylesheet" href="/styles.css">
        </head>
      `,
      errors: [
        {
          messageId: 'unnecessaryPreload',
          data: {
            href: '/app.js',
            tagName: 'script',
          },
        },
        {
          messageId: 'unnecessaryPreload',
          data: {
            href: '/styles.css',
            tagName: 'link',
          },
        },
      ],
    },
    {
      name: 'case-insensitive rel attribute',
      code: dedent`
        <head>
          <link rel="PRELOAD" href="/app.js" as="script">
          <script src="/app.js"></script>
        </head>
      `,
      errors: [
        {
          messageId: 'unnecessaryPreload',
        },
      ],
    },
    {
      name: 'preload with ./ prefix matching script without prefix',
      code: dedent`
        <head>
          <link rel="preload" href="./app.js" as="script">
          <script src="app.js"></script>
        </head>
      `,
      errors: [
        {
          messageId: 'unnecessaryPreload',
        },
      ],
    },
    {
      name: 'preload with elements in between before script tag',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <link rel="preload" href="/app.js" as="script">
          <title>Test Page</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="/other.css">
          <script src="/app.js"></script>
        </head>
      `,
      errors: [
        {
          messageId: 'unnecessaryPreload',
          data: {
            href: '/app.js',
            tagName: 'script',
          },
        },
      ],
    },
    {
      name: 'preload with elements in between before stylesheet',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <title>Test Page</title>
          <link rel="preload" href="/styles.css" as="style">
          <meta name="description" content="Test">
          <script src="/analytics.js" async></script>
          <link rel="stylesheet" href="/styles.css">
        </head>
      `,
      errors: [
        {
          messageId: 'unnecessaryPreload',
          data: {
            href: '/styles.css',
            tagName: 'link',
          },
        },
      ],
    },
    {
      name: 'script tag before preload with elements in between',
      code: dedent`
        <head>
          <meta charset="utf-8">
          <script src="/app.js"></script>
          <title>Test Page</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="preload" href="/app.js" as="script">
          <link rel="stylesheet" href="/other.css">
        </head>
      `,
      errors: [
        {
          messageId: 'unnecessaryPreload',
          data: {
            href: '/app.js',
            tagName: 'script',
          },
        },
      ],
    },
  ],
});
