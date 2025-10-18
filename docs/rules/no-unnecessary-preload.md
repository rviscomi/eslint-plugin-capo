# no-unnecessary-preload

Disallow preload links for resources already discoverable by other elements.

## Background

Resource hints like `<link rel="preload">` and `<link rel="modulepreload">` are powerful tools for optimizing performance by telling the browser to fetch critical resources early. However, they should only be used for resources that the browser would discover late in the loading process.

Preloading resources that are already discoverable by other elements in the `<head>` (like `<script>` or `<link rel="stylesheet">` tags) is unnecessary and wasteful because:

- The browser's preload scanner already discovers these resources early
- Unnecessary preloads waste the browser's limited preload budget
- They consume bandwidth without providing any performance benefit
- They add unnecessary complexity to your HTML

## When Preload is Useful

Preload is beneficial for resources that are:

- **Late-discovered**: Referenced in CSS (`@font-face`, `background-image`) or JavaScript
- **Dynamically loaded**: Injected by JavaScript at runtime
- **Critical but hidden**: Important resources not immediately visible in the HTML

## When Preload is NOT Useful

Preload should NOT be used for:

- Scripts already referenced with `<script src="...">` in the same document
- Stylesheets already referenced with `<link rel="stylesheet">` in the same document
- Resources the browser can discover through its preload scanner

## Rule Details

This rule warns when it detects a `<link rel="preload">` or `<link rel="modulepreload">` that references the same resource as a `<script>` or `<link rel="stylesheet">` element in the same `<head>`.

Examples of **incorrect** code:

```html
<!-- eslint capo/no-unnecessary-preload: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <!-- BAD: Preloading a script that's already in the head -->
    <link rel="preload" href="/app.js" as="script" />
    <script src="/app.js"></script>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

```html
<!-- eslint capo/no-unnecessary-preload: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <!-- BAD: Preloading a stylesheet that's already in the head -->
    <link rel="preload" href="/styles.css" as="style" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

```html
<!-- eslint capo/no-unnecessary-preload: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <!-- BAD: Even if preload comes after, it's still unnecessary -->
    <script src="/app.js"></script>
    <link rel="preload" href="/app.js" as="script" />
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/no-unnecessary-preload: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <!-- GOOD: Preloading a font that won't be discovered until CSS is parsed -->
    <link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

```html
<!-- eslint capo/no-unnecessary-preload: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <!-- GOOD: Preloading an image that will be dynamically loaded by JS -->
    <link rel="preload" href="/hero-image.jpg" as="image" />
    <script src="/app.js"></script>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

```html
<!-- eslint capo/no-unnecessary-preload: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <!-- GOOD: Preloading a module that will be imported by the main script -->
    <link rel="modulepreload" href="/utils.js" />
    <script src="/app.js" type="module"></script>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

## When Not to Use It

You might disable this rule if:

- You're using a build tool that automatically manages preload hints and removes duplicates
- You have a specific edge case where duplicate preloads are intentional (though this is rare)

However, in most cases, this rule helps prevent common performance anti-patterns.

## Performance Impact

Unnecessary preloads can:

- **Waste bandwidth**: Resources are effectively requested twice
- **Consume preload budget**: Browsers limit concurrent preload requests
- **Delay other resources**: Unnecessary preloads compete with critical resources for bandwidth

## Prior Art

- [MDN - Preloading content](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)
- [web.dev - Preload critical assets](https://web.dev/preload-critical-assets/)
- [capo.js validation rules](https://github.com/rviscomi/capo.js)
- [Resource Hints Spec](https://www.w3.org/TR/resource-hints/)

## Related Rules

- `require-order` - Validates optimal ordering of head elements including preload hints
