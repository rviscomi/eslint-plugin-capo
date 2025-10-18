# no-invalid-head-elements

Disallow invalid elements in the HTML head.

## Background

According to the HTML specification, the `<head>` element has a strict set of allowed children. Only specific metadata elements are permitted:

- `<base>` - Specifies the base URL for relative URLs
- `<link>` - Links to external resources (stylesheets, icons, etc.)
- `<meta>` - Provides metadata about the document
- `<noscript>` - Defines alternative content for users with JavaScript disabled
- `<script>` - Embeds or references executable code
- `<style>` - Contains CSS style information
- `<template>` - Declares HTML fragments to be cloned
- `<title>` - Defines the document's title

Content elements (like `<div>`, `<span>`, `<p>`, etc.) should never appear in the `<head>`. Including invalid elements:

- Violates HTML standards
- Can cause unpredictable browser behavior
- May cause parsing errors
- Indicates a structural problem in the HTML document

## Rule Details

This rule warns when elements other than the allowed metadata elements are found within the `<head>` element.

Examples of **incorrect** code:

```html
<!-- eslint capo/no-invalid-head-elements: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Page</title>
  <div>This shouldn't be here</div>
  <span>Neither should this</span>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

```html
<!-- eslint capo/no-invalid-head-elements: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <p>Invalid paragraph in head</p>
  <h1>Invalid heading in head</h1>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/no-invalid-head-elements: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Page</title>
  <base href="https://example.com/">
  <link rel="stylesheet" href="styles.css">
  <script src="app.js" defer></script>
  <style>
    body { margin: 0; }
  </style>
  <noscript>
    <link rel="stylesheet" href="noscript.css">
  </noscript>
  <template id="my-template">
    <div>Template content</div>
  </template>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

## When Not to Use It

There is no valid reason to disable this rule as only specific metadata elements are allowed in the `<head>` according to the HTML specification.

## Prior Art

- [WHATWG HTML Standard - The head element](https://html.spec.whatwg.org/multipage/semantics.html#the-head-element)
- [MDN - head element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)
- [W3C HTML Validator](https://validator.w3.org/)
