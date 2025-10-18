# valid-charset

Ensure proper UTF-8 character encoding is declared.

## Background

Character encoding tells the browser how to interpret the bytes in an HTML document. UTF-8 is the recommended encoding for web documents because:

- It supports all Unicode characters
- It's backward compatible with ASCII
- It's the de facto standard for modern web development
- It's required by many specifications and best practices

Common issues include:

- Using outdated encodings like `ISO-8859-1`
- Having duplicate charset declarations
- Using the deprecated `http-equiv` method for charset declaration

The modern, recommended way to declare charset is:

```html
<meta charset="utf-8">
```

## Rule Details

This rule warns when:

- A charset other than UTF-8 is declared
- Multiple charset declarations exist (even if they're both UTF-8)
- The deprecated `http-equiv="content-type"` method is used alongside `<meta charset>`

Examples of **incorrect** code:

```html
<!-- eslint capo/valid-charset: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- Outdated encoding -->
  <meta charset="ISO-8859-1">
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

```html
<!-- eslint capo/valid-charset: "error" -->

<!DOCTYPE html>
<html>
<head>
  <!-- Duplicate charset declarations -->
  <meta charset="utf-8">
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/valid-charset: "error" -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

## When Not to Use It

You might disable this rule if you're working with legacy systems that genuinely require a different character encoding. However, this is extremely rare in modern web development, and you should make every effort to migrate to UTF-8.

## Prior Art

- [WHATWG HTML Standard - Specifying the document's character encoding](https://html.spec.whatwg.org/multipage/semantics.html#charset)
- [MDN - Declaring character encodings in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#charset)
- [W3C Internationalization - Declaring character encodings](https://www.w3.org/International/questions/qa-html-encoding-declarations)
