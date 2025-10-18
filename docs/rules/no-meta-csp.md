# no-meta-csp

Disallow CSP meta tags that disable the preload scanner.

## Background

Content Security Policy (CSP) is an important security feature that helps prevent XSS attacks. However, implementing CSP via `<meta>` tags has significant performance drawbacks:

- **Disables the Preload Scanner**: Chrome's preload scanner, which speculatively fetches resources while the HTML is being parsed, is disabled when a CSP meta tag is encountered. This can significantly impact page load performance.
- **Timing Issues**: Meta CSP tags only take effect after they're parsed, leaving a window where resources can be loaded without CSP protection.
- **Limited Functionality**: Some CSP directives (like `frame-ancestors` and `report-uri`) don't work in meta tags.

The recommended approach is to use HTTP headers to set CSP instead:

```http
Content-Security-Policy: default-src 'self'
```

## Rule Details

This rule warns when it detects `<meta>` tags with `http-equiv="Content-Security-Policy"`.

Examples of **incorrect** code:

```html
<!-- eslint capo/no-meta-csp: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/no-meta-csp: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- Use HTTP headers instead -->
  <!-- Content-Security-Policy: default-src 'self' -->
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

## When Not to Use It

You might disable this rule if:

- You have no control over HTTP headers (e.g., static site hosting with limited configuration)
- You're working with legacy systems that require meta CSP tags
- Performance is not a critical concern for your use case

However, in most cases, it's recommended to use HTTP headers for CSP.

## Prior Art

- [Chrome Bug #1458493 - CSP meta tags disable preload scanner](https://crbug.com/1458493)
- [MDN - Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
- [capo.js validation rules](https://github.com/rviscomi/capo.js)
