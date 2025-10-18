# require-meta-viewport

Require a viewport meta tag in the head.

## Background

The viewport meta tag is essential for responsive web design on mobile devices. Without it:

- Mobile browsers assume the page is designed for desktop screens
- The page is rendered at a desktop width (typically 980px) and scaled down
- Text becomes too small to read
- Users must manually zoom and pan to view content
- The page won't respond properly to different screen sizes

The viewport meta tag tells the browser to use the device's actual screen width and provides proper scaling:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

This is considered a fundamental requirement for mobile-friendly websites.

## Rule Details

This rule warns when a `<head>` element is missing a viewport meta tag.

Examples of **incorrect** code:

```html
<!-- eslint capo/require-meta-viewport: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My Page</title>
    <!-- Missing viewport meta tag -->
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/require-meta-viewport: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

## When Not to Use It

You might disable this rule if:

- You're building a desktop-only application
- You're working with HTML email templates (where viewport tags aren't applicable)
- You're creating partial HTML fragments that will be embedded in a larger document

However, for any standalone web page, the viewport meta tag is essential for proper mobile display.

## Prior Art

- [MDN - Viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
- [Google - Responsive Web Design Basics](https://developers.google.com/search/mobile-sites/mobile-seo/responsive-design)
- [Web.dev - Responsive web design basics](https://web.dev/responsive-web-design-basics/)
