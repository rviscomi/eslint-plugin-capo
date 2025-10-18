# require-order

Validate that head elements are in optimal order for performance.

## Background

The order of elements in the `<head>` section significantly impacts page load performance. Browsers process head elements sequentially, and certain elements can block rendering or resource loading.

Based on research from [capo.js](https://github.com/rviscomi/capo.js), elements should be ordered by their "weight" - how critical they are to initial page rendering and user experience:

1. **Critical Metadata** (weight 10): `charset`, `viewport`, CSP, origin-trial
2. **Document Title** (weight 9): `<title>` element
3. **Preconnect** (weight 8): Early DNS/connection setup
4. **Async Scripts** (weight 7): Non-blocking scripts with `async`
5. **Import Styles** (weight 6): CSS `@import` (blocks rendering)
6. **Sync Scripts** (weight 5): Blocking scripts without `async`/`defer`
7. **Sync Styles** (weight 4): Regular `<link rel="stylesheet">`
8. **Preload** (weight 3): Resource hints with `<link rel="preload">`
9. **Defer Scripts** (weight 2): Scripts with `defer` or `type="module"`
10. **Prefetch/Prerender** (weight 1): Low-priority hints
11. **Other** (weight 0): Everything else

## Rule Details

This rule warns when head elements are not in optimal order according to the weight hierarchy. Elements with higher weights should appear before elements with lower weights.

Examples of **incorrect** code:

```html
<!-- eslint capo/require-order: "warn" -->

<!DOCTYPE html>
<html>
  <head>
    <!-- BAD: Elements out of order -->
    <script src="/app.js" defer></script>
    <!-- weight 2, too early -->
    <title>Page</title>
    <!-- weight 9, should be earlier -->
    <link rel="preload" href="/font.woff2" as="font" />
    <!-- weight 3 -->
    <meta charset="utf-8" />
    <!-- weight 10, should be first -->
    <link rel="stylesheet" href="/styles.css" />
    <!-- weight 4 -->
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

```html
<!-- eslint capo/require-order: "warn" -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/styles.css" />
    <!-- weight 4 -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- weight 10, should be earlier -->
    <title>Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/head-element-order: "warn" -->

<!DOCTYPE html>
<html>
  <head>
    <!-- 1. Critical metadata (weight 10) -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- 2. Title (weight 9) -->
    <title>Page</title>

    <!-- 3. Preconnect (weight 8) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />

    <!-- 4. Async scripts (weight 7) -->
    <script src="/analytics.js" async></script>

    <!-- 5. Sync styles (weight 4) -->
    <link rel="stylesheet" href="/styles.css" />

    <!-- 6. Preload (weight 3) -->
    <link rel="preload" href="/font.woff2" as="font" crossorigin />

    <!-- 7. Defer scripts (weight 2) -->
    <script src="/app.js" defer></script>

    <!-- 8. Prefetch (weight 1) -->
    <link rel="prefetch" href="/next-page.html" />
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

## Element Weight Reference

| Weight | Element Type       | Examples                                                                                                                      |
| ------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 10     | META (critical)    | `<meta charset>`, `<meta name="viewport">`, `<meta http-equiv="content-security-policy">`, `<meta http-equiv="origin-trial">` |
| 9      | TITLE              | `<title>`                                                                                                                     |
| 8      | PRECONNECT         | `<link rel="preconnect">`, `<link rel="dns-prefetch">`                                                                        |
| 7      | ASYNC_SCRIPT       | `<script async>`                                                                                                              |
| 6      | IMPORT_STYLES      | `<style>@import</style>`                                                                                                      |
| 5      | SYNC_SCRIPT        | `<script>` (without async/defer)                                                                                              |
| 4      | SYNC_STYLES        | `<link rel="stylesheet">`, `<style>`                                                                                          |
| 3      | PRELOAD            | `<link rel="preload">`, `<link rel="modulepreload">`                                                                          |
| 2      | DEFER_SCRIPT       | `<script defer>`, `<script type="module">`                                                                                    |
| 1      | PREFETCH_PRERENDER | `<link rel="prefetch">`, `<link rel="prerender">`                                                                             |
| 0      | OTHER              | All other elements                                                                                                            |

## Performance Impact

Proper element ordering provides several benefits:

- **Faster Text Rendering**: Critical metadata and styles load first
- **Better Resource Loading**: Early connection hints reduce latency
- **Improved Interactivity**: Non-blocking scripts load appropriately
- **Optimized Critical Path**: Render-blocking resources load in correct order
- **Better User Experience**: Content appears faster and more smoothly

## When Not to Use It

This rule is advisory and may be noisy for existing projects. You might disable it if:

- You're working with legacy code where reordering isn't feasible
- Your build process generates HTML and can't easily control element order
- You have specific requirements that conflict with the weight hierarchy
- You prefer to focus on other performance optimizations first

However, following these ordering guidelines can provide measurable performance improvements.

## Prior Art

- [capo.js - Get your `<head>` in order](https://github.com/rviscomi/capo.js)
- [Harry Roberts - CSS Wizardry - The Importance of `@import`](https://csswizardry.com/2018/11/css-and-network-performance/)
- [MDN - Optimizing your pages for speculative parsing](https://developer.mozilla.org/en-US/docs/Web/HTML/Optimizing_your_pages_for_speculative_parsing)
