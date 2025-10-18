# valid-meta-viewport

Ensure viewport meta tag is properly configured for accessibility.

## Background

The viewport meta tag controls how a web page is displayed on mobile devices. However, certain viewport configurations can create serious accessibility issues:

- **Disabling Zoom**: Using `user-scalable=no` or `user-scalable=0` prevents users from zooming, which violates WCAG 2.1 Success Criterion 1.4.4 (Resize text)
- **Restricting Zoom**: Setting `maximum-scale` to less than 5 prevents sufficient zooming for users with low vision
- **Multiple Viewport Tags**: Having more than one viewport meta tag can cause unpredictable behavior

Users with low vision often need to zoom in to 200% or more to read content comfortably. Preventing or restricting zoom creates barriers for these users.

## Rule Details

This rule warns when viewport meta tags:

- Disable user scaling (`user-scalable=no` or `user-scalable=0`)
- Set `maximum-scale` to less than 5
- Appear multiple times in the same document

Examples of **incorrect** code:

```html
<!-- eslint capo/valid-meta-viewport: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- Disables zooming (accessibility issue) -->
  <meta name="viewport" content="width=device-width, user-scalable=no">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

```html
<!-- eslint capo/valid-meta-viewport: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- Restricts zoom too much -->
  <meta name="viewport" content="width=device-width, maximum-scale=1.0">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

```html
<!-- eslint capo/valid-meta-viewport: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- Multiple viewport tags -->
  <meta name="viewport" content="width=device-width">
  <meta name="viewport" content="initial-scale=1">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/valid-meta-viewport: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

```html
<!-- eslint capo/valid-meta-viewport: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- Allows sufficient zooming -->
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

## When Not to Use It

There is generally no valid reason to disable this rule, as proper viewport configuration is essential for accessibility. However, you might temporarily disable it if:

- You're working with legacy code and accessibility fixes are planned for a future iteration
- You have a specific, documented reason why zoom needs to be restricted (though this is rarely justified)

## Prior Art

- [WCAG 2.1 Success Criterion 1.4.4: Resize text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html)
- [MDN - Viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
- [axe-core accessibility testing - meta-viewport-large](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md#meta-viewport-large)
