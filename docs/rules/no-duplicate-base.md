# no-duplicate-base

Disallow multiple base elements in the head.

## Background

The `<base>` element specifies the base URL for all relative URLs in a document. According to the HTML specification:

- There can be at most one `<base>` element per document
- If multiple base elements exist, all but the first are ignored
- Having multiple base elements can lead to confusion and maintenance issues
- The presence of duplicate base elements often indicates a mistake

## Rule Details

This rule warns when multiple `<base>` elements are found within the same `<head>` element.

Examples of **incorrect** code:

```html
<!-- eslint capo/no-duplicate-base: "error" -->

<!DOCTYPE html>
<html>
<head>
  <base href="https://example.com/">
  <base href="https://other.com/">
</head>
<body>
  <a href="page">Link</a>
</body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/no-duplicate-base: "error" -->

<!DOCTYPE html>
<html>
<head>
  <base href="https://example.com/">
</head>
<body>
  <a href="page">Link</a>
</body>
</html>
```

```html
<!-- eslint capo/no-duplicate-base: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- No base element is also valid -->
</head>
<body>
  <a href="https://example.com/page">Link</a>
</body>
</html>
```

## When Not to Use It

There is no valid reason to disable this rule as multiple base elements violate the HTML specification.

## Prior Art

- [WHATWG HTML Standard - The base element](https://html.spec.whatwg.org/multipage/semantics.html#the-base-element)
