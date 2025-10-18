# no-invalid-http-equiv

Disallow invalid or deprecated http-equiv meta tags.

## Background

The `http-equiv` attribute on `<meta>` tags simulates HTTP response headers. However:

- Many `http-equiv` values are deprecated or non-standard
- Some values should use the `name` attribute instead
- Others should be set as actual HTTP headers for better performance and reliability
- Deprecated values like `X-UA-Compatible` were specific to older versions of Internet Explorer

Common issues include:

- Using `http-equiv` for values that should use `name` (e.g., `description`, `keywords`)
- Using deprecated IE-specific values like `X-UA-Compatible`
- Using values better suited for HTTP headers (e.g., `Cache-Control`, `Expires`)

## Rule Details

This rule warns when it detects invalid, deprecated, or misused `http-equiv` values in meta tags.

Examples of **incorrect** code:

```html
<!-- eslint capo/no-invalid-http-equiv: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- Deprecated IE feature -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- Should use HTTP headers -->
  <meta http-equiv="Cache-Control" content="no-cache">
  
  <!-- Wrong attribute (should be name, not http-equiv) -->
  <meta http-equiv="description" content="Page description">
  <meta http-equiv="keywords" content="html, meta, tags">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/no-invalid-http-equiv: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="description" content="Page description">
  <meta name="keywords" content="html, meta, tags">
  
  <!-- Use HTTP headers for cache control instead -->
  <!-- Cache-Control: no-cache -->
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

Valid `http-equiv` values (when needed):

```html
<!-- eslint capo/no-invalid-http-equiv: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="30">
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta http-equiv="default-style" content="main">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

## When Not to Use It

You might disable this rule if you're maintaining legacy code that requires specific deprecated meta tags for compatibility with older browsers.

## Prior Art

- [MDN - http-equiv](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#http-equiv)
- [WHATWG HTML Standard - Pragma directives](https://html.spec.whatwg.org/multipage/semantics.html#pragma-directives)
- [capo.js validation rules](https://github.com/rviscomi/capo.js)
