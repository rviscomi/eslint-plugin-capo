# require-title

Require a title element in the head.

## Background

The `<title>` element is essential for HTML documents as it:

- Defines the document's title shown in browser tabs and bookmarks
- Is used by search engines for page indexing and display in search results
- Provides context for screen readers and assistive technologies
- Is required by the HTML specification for valid documents

Every HTML document should have exactly one `<title>` element within the `<head>` section.

## Rule Details

This rule warns when a `<head>` element is missing a `<title>` element.

Examples of **incorrect** code:

```html
<!-- eslint capo/require-title: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <!-- Missing title -->
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/require-title: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My Page Title</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

## When Not to Use It

You should not disable this rule as the `<title>` element is essential for accessibility, SEO, and valid HTML. However, you might disable it for partial HTML fragments that are not complete documents.

## Prior Art

- [htmlhint `title-require`](https://htmlhint.com/docs/user-guide/rules/title-require)
- [WHATWG HTML Standard - The title element](https://html.spec.whatwg.org/multipage/semantics.html#the-title-element)
