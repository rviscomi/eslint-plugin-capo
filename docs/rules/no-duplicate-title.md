# no-duplicate-title

Disallow multiple title elements in the head.

## Background

According to the HTML specification, a document must have exactly one `<title>` element in the `<head>` section. Having multiple title elements:

- Violates HTML standards
- Can cause unpredictable behavior across browsers
- May confuse search engines and assistive technologies
- Only the first title is typically used, making subsequent titles misleading

## Rule Details

This rule warns when multiple `<title>` elements are found within the same `<head>` element.

Examples of **incorrect** code:

```html
<!-- eslint capo/no-duplicate-title: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>First Title</title>
  <title>Second Title</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/no-duplicate-title: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Page Title</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

## When Not to Use It

There is no valid reason to disable this rule as multiple title elements violate the HTML specification.

## Prior Art

- [WHATWG HTML Standard - The title element](https://html.spec.whatwg.org/multipage/semantics.html#the-title-element)
