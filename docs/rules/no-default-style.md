# no-default-style

Disallow the default-style meta tag.

## Background

The `default-style` meta tag (using `http-equiv="default-style"`) was designed to specify which stylesheet should be used by default when multiple stylesheets are available. However:

- It's poorly supported across browsers
- It can cause a Flash of Unstyled Content (FOUC) as the browser needs to parse the HTML to discover which stylesheet to use
- Modern CSS features like `@media` queries, CSS custom properties, and `@layer` provide better alternatives
- The feature is considered legacy and rarely used in modern web development

## Rule Details

This rule warns when it detects a meta tag with `http-equiv="default-style"`.

Examples of **incorrect** code:

```html
<!-- eslint capo/no-default-style: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="default-style" content="main">
  <link rel="stylesheet" href="default.css" title="main">
  <link rel="alternate stylesheet" href="alt.css" title="alt">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/no-default-style: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- Use standard stylesheet without default-style meta -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

```html
<!-- eslint capo/no-default-style: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- Use CSS features for conditional styling -->
  <link rel="stylesheet" href="light.css" media="(prefers-color-scheme: light)">
  <link rel="stylesheet" href="dark.css" media="(prefers-color-scheme: dark)">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

## When Not to Use It

You might disable this rule if you're maintaining legacy code that relies on the `default-style` feature for alternate stylesheets. However, you should consider migrating to modern CSS approaches.

## Prior Art

- [MDN - default-style](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#http-equiv)
- [WHATWG HTML Standard - Pragma directives](https://html.spec.whatwg.org/multipage/semantics.html#pragma-directives)
- [capo.js validation rules](https://github.com/rviscomi/capo.js)
