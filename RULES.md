# Rule Reference

Quick reference guide for all eslint-plugin-capo rules.

## Rule Index

| Rule | Category | Severity | Description |
|------|----------|----------|-------------|
| [no-invalid-head-elements](#no-invalid-head-elements) | Best Practices | error | Only allows valid HTML head elements |
| [require-title](#require-title) | Best Practices | error | Requires exactly one title element |
| [no-duplicate-base](#no-duplicate-base) | Best Practices | error | Disallows multiple base elements |
| [no-meta-csp](#no-meta-csp) | Performance | error | Disallows CSP meta tags |
| [no-invalid-http-equiv](#no-invalid-http-equiv) | Best Practices | warn | Validates http-equiv meta tags |
| [valid-meta-viewport](#valid-meta-viewport) | Accessibility | error | Ensures proper viewport configuration |
| [valid-charset](#valid-charset) | Best Practices | error | Requires UTF-8 character encoding |
| [no-default-style](#no-default-style) | Best Practices | warn | Discourages default-style meta tag |
| [head-element-order](#head-element-order) | Performance | warn | Validates optimal element ordering |

---

## no-invalid-head-elements

**Type:** Problem  
**Category:** Best Practices  
**Recommended:** Yes  
**Default Severity:** error

### Description
Ensures only valid elements are used in the `<head>`. Valid elements are: `base`, `link`, `meta`, `noscript`, `script`, `style`, `template`, `title`.

### Examples

❌ **Incorrect:**
```html
<head>
  <div>Content</div>
  <p>Paragraph</p>
</head>
```

✅ **Correct:**
```html
<head>
  <title>Page Title</title>
  <meta charset="utf-8">
</head>
```

---

## require-title

**Type:** Problem  
**Category:** Best Practices  
**Recommended:** Yes  
**Default Severity:** error

### Description
Requires exactly one `<title>` element in the head. The title element should be the first of its type.

### Examples

❌ **Incorrect:**
```html
<head>
  <!-- Missing title -->
</head>

<head>
  <title>First</title>
  <title>Second</title>
</head>
```

✅ **Correct:**
```html
<head>
  <title>Page Title</title>
</head>
```

---

## no-duplicate-base

**Type:** Problem  
**Category:** Best Practices  
**Recommended:** Yes  
**Default Severity:** error

### Description
Disallows multiple `<base>` elements. Only one base element is allowed per document.

### Examples

❌ **Incorrect:**
```html
<head>
  <base href="https://example.com/">
  <base href="https://other.com/">
</head>
```

✅ **Correct:**
```html
<head>
  <base href="https://example.com/">
</head>
```

---

## no-meta-csp

**Type:** Problem  
**Category:** Performance  
**Recommended:** Yes  
**Default Severity:** error

### Description
Disallows CSP meta tags because they disable Chrome's preload scanner. Use HTTP headers instead.

### Examples

❌ **Incorrect:**
```html
<head>
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
</head>
```

✅ **Correct:**
```html
<!-- Use HTTP header instead -->
<!-- Content-Security-Policy: default-src 'self' -->
```

### References
- [Chrome Bug #1458493](https://crbug.com/1458493)

---

## no-invalid-http-equiv

**Type:** Problem  
**Category:** Best Practices  
**Recommended:** Yes  
**Default Severity:** warn

### Description
Validates http-equiv meta tags and catches deprecated or non-standard values.

### Detected Issues

#### Deprecated IE Features
- `X-UA-Compatible`
- `imagetoolbar`
- `MSThemeCompatible`
- Many more...

#### Should Use HTTP Headers
- `Cache-Control`
- `Pragma`
- `Expires`
- `X-Frame-Options`

#### Wrong Attribute Type
Using `http-equiv` when `name` should be used:
- `description`, `keywords`, `author`, etc.

### Examples

❌ **Incorrect:**
```html
<head>
  <!-- Deprecated IE feature -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- Should use HTTP header -->
  <meta http-equiv="Cache-Control" content="no-cache">
  
  <!-- Wrong attribute (should be name) -->
  <meta http-equiv="description" content="...">
</head>
```

✅ **Correct:**
```html
<head>
  <meta name="description" content="...">
  <!-- Use HTTP headers for cache control -->
</head>
```

---

## valid-meta-viewport

**Type:** Problem  
**Category:** Accessibility  
**Recommended:** Yes  
**Default Severity:** error

### Description
Ensures meta viewport is properly configured for accessibility.

### Accessibility Checks
- ❌ `user-scalable=no` - Disables zooming
- ❌ `maximum-scale < 2` - Limits zoom too much
- ⚠️ Invalid directive values
- ⚠️ Multiple viewport declarations

### Examples

❌ **Incorrect:**
```html
<head>
  <!-- Disables zooming -->
  <meta name="viewport" content="width=device-width, user-scalable=no">
  
  <!-- Limits zoom too much -->
  <meta name="viewport" content="width=device-width, maximum-scale=1.0">
  
  <!-- Multiple declarations -->
  <meta name="viewport" content="width=device-width">
  <meta name="viewport" content="initial-scale=1">
</head>
```

✅ **Correct:**
```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
```

### References
- [WCAG 2.1 Success Criterion 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html)

---

## valid-charset

**Type:** Problem  
**Category:** Best Practices  
**Recommended:** Yes  
**Default Severity:** error

### Description
Ensures proper UTF-8 character encoding is declared. Only one charset declaration is allowed.

### Examples

❌ **Incorrect:**
```html
<head>
  <!-- Non-UTF-8 charset -->
  <meta charset="ISO-8859-1">
</head>

<head>
  <!-- Multiple declarations -->
  <meta charset="utf-8">
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
</head>
```

✅ **Correct:**
```html
<head>
  <meta charset="utf-8">
</head>
```

### References
- [HTML Standard - Character Encoding](https://html.spec.whatwg.org/multipage/semantics.html#character-encoding-declaration)

---

## no-default-style

**Type:** Suggestion  
**Category:** Best Practices  
**Recommended:** Yes  
**Default Severity:** warn

### Description
Discourages use of default-style meta tag because it causes flash of unstyled content (FOUC). Use modern CSS features like `@media` rules instead.

### Examples

❌ **Incorrect:**
```html
<head>
  <meta http-equiv="default-style" content="main">
  <link rel="stylesheet" href="main.css" title="main">
  <link rel="alternate stylesheet" href="alt.css" title="alt">
</head>
```

✅ **Correct:**
```html
<head>
  <link rel="stylesheet" href="styles.css">
  <!-- Use CSS @media queries for variations -->
</head>
```

---

## Rule Categories

### Performance
Rules that affect page load performance:
- `no-meta-csp` - CSP meta tags disable preload scanner

### Accessibility
Rules that affect user accessibility:
- `valid-meta-viewport` - Ensures proper zooming capabilities

### Best Practices
Rules that follow web standards:
- `no-invalid-head-elements`
- `require-title`
- `no-duplicate-base`
- `no-invalid-http-equiv`
- `valid-charset`
- `no-default-style`

---

## Configuration

### Enable All Rules
```javascript
import capo from 'eslint-plugin-capo';

export default [
  capo.configs.strict,
];
```

### Enable Specific Categories
```javascript
import capo from 'eslint-plugin-capo';

export default [
  // Performance only
  capo.configs.performance,
  
  // Accessibility only
  capo.configs.accessibility,
];
```

### Customize Rules
```javascript
import capo from 'eslint-plugin-capo';

export default [
  {
    plugins: { capo },
    rules: {
      'capo/no-meta-csp': 'error',
      'capo/valid-meta-viewport': 'error',
      'capo/no-invalid-http-equiv': 'off',
      'capo/head-element-order': 'warn', // Enable ordering validation
    },
  },
];
```

---

## head-element-order

**Type:** Suggestion  
**Category:** Performance  
**Recommended:** No (opt-in)  
**Default Severity:** warn

### Description
Validates that head elements are in optimal order for performance based on capo.js weight hierarchy. Elements with higher weights should come before elements with lower weights.

### Element Weight Hierarchy

| Weight | Element Type | Description | Examples |
|--------|--------------|-------------|----------|
| 10 | META | Critical metadata | `<meta charset>`, `<meta name="viewport">`, CSP, origin-trial, `<base>` |
| 9 | TITLE | Document title | `<title>` |
| 8 | PRECONNECT | Early connection hints | `<link rel="preconnect">` |
| 7 | ASYNC_SCRIPT | Non-blocking scripts | `<script async>` |
| 6 | IMPORT_STYLES | CSS @import | `<style>@import</style>` |
| 5 | SYNC_SCRIPT | Blocking scripts | `<script src="..."></script>` |
| 4 | SYNC_STYLES | Blocking stylesheets | `<link rel="stylesheet">`, `<style>` |
| 3 | PRELOAD | Resource hints | `<link rel="preload">`, `<link rel="modulepreload">` |
| 2 | DEFER_SCRIPT | Deferred scripts | `<script defer>`, `<script type="module">` |
| 1 | PREFETCH_PRERENDER | Low priority hints | `<link rel="prefetch">`, `<link rel="dns-prefetch">` |
| 0 | OTHER | Everything else | Icons, theme-color, etc. |

### Why Ordering Matters

1. **Critical Metadata First** - Charset and viewport need to be parsed early
2. **Early Connections** - Preconnect allows parallel connection setup
3. **Resource Discovery** - Async scripts can start downloading immediately
4. **Render Blocking** - Sync scripts and styles in optimal positions
5. **Progressive Enhancement** - Deferred and prefetched resources load last

### Examples

❌ **Incorrect:**
```html
<head>
  <!-- weight 2 - too early -->
  <script src="/app.js" defer></script>
  
  <!-- weight 9 - should be near top -->
  <title>My Page</title>
  
  <!-- weight 3 -->
  <link rel="preload" href="/font.woff2" as="font">
  
  <!-- weight 10 - should be first -->
  <meta charset="utf-8">
  
  <!-- weight 1 - OK at end but others out of order -->
  <link rel="prefetch" href="/next.html">
</head>
```

✅ **Correct:**
```html
<head>
  <!-- weight 10 - META -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- weight 9 - TITLE -->
  <title>My Page</title>
  
  <!-- weight 8 - PRECONNECT -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  
  <!-- weight 7 - ASYNC_SCRIPT -->
  <script src="/analytics.js" async></script>
  
  <!-- weight 4 - SYNC_STYLES -->
  <link rel="stylesheet" href="/styles.css">
  
  <!-- weight 3 - PRELOAD -->
  <link rel="preload" href="/font.woff2" as="font">
  
  <!-- weight 2 - DEFER_SCRIPT -->
  <script src="/app.js" defer></script>
  
  <!-- weight 1 - PREFETCH -->
  <link rel="prefetch" href="/next.html">
  
  <!-- weight 0 - OTHER -->
  <link rel="icon" href="/favicon.ico">
</head>
```

### When to Use

This rule is **not included in the `recommended` preset** because it can be noisy in existing codebases. Enable it when:

- Starting a new project
- Optimizing page load performance
- Following capo.js best practices strictly

### Configuration

Enable in specific configs:
```javascript
// Just ordering
capo.configs.ordering

// Strict (includes ordering)
capo.configs.strict

// Performance (includes ordering)
capo.configs.performance
```

Or enable manually:
```javascript
{
  rules: {
    'capo/head-element-order': 'warn', // or 'error'
  }
}
```

### References
- [capo.js - Get your head in order](https://github.com/rviscomi/capo.js)
- [Optimal head element ordering](https://github.com/rviscomi/capo.js/blob/main/src/lib/rules.js)

---
