# eslint-plugin-capo

ESLint plugin to validate HTML `<head>` elements based on [capo.js](https://github.com/rviscomi/capo.js) validation rules. This plugin helps catch common issues with metadata, performance problems, accessibility concerns, and deprecated practices in HTML head sections.

## Features

- ✅ **Modern Flat Config Support** - Works with ESLint 9+ flat config format
- 🚀 **Performance** - Detects CSP meta tags that disable the preload scanner and validates optimal element ordering
- ♿ **Accessibility** - Validates viewport settings for proper zooming behavior
- 📱 **Best Practices** - Catches deprecated and non-standard meta tags
- 🎯 **Comprehensive** - Based on battle-tested capo.js validation rules
- 📊 **Element Ordering** - Ensures head elements are in optimal order for performance

## Installation

```bash
npm install --save-dev eslint-plugin-capo @html-eslint/parser
```

**Requirements:**
- ESLint >= 8.0.0
- Node.js >= 18.0.0
- `@html-eslint/parser` for parsing HTML files

## Usage

### Flat Config (ESLint 9+)

Create or update your `eslint.config.js`:

```javascript
import capo from 'eslint-plugin-capo';
import htmlParser from '@html-eslint/parser';

export default [
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: htmlParser,
    },
  },
  capo.configs.recommended,
];
```

### With Vue

```javascript
import capo from 'eslint-plugin-capo';
import vue from 'eslint-plugin-vue';

export default [
  ...vue.configs['flat/recommended'],
  capo.configs.recommended,
];
```

### With React/Next.js

```javascript
import capo from 'eslint-plugin-capo';
import react from 'eslint-plugin-react';

export default [
  react.configs.flat.recommended,
  {
    files: ['**/head.tsx', '**/layout.tsx', '**/_document.tsx'],
    ...capo.configs.recommended,
  },
];
```

## Configuration Presets

### `recommended` (Default)

Balanced rules for production use:

```javascript
import capo from 'eslint-plugin-capo';

export default [
  capo.configs.recommended,
];
```

### `strict`

All rules as errors:

```javascript
import capo from 'eslint-plugin-capo';

export default [
  capo.configs.strict,
];
```

### `performance`

Performance-focused rules only:

```javascript
import capo from 'eslint-plugin-capo';

export default [
  capo.configs.performance,
];
```

### `accessibility`

Accessibility-focused rules only:

```javascript
import capo from 'eslint-plugin-capo';

export default [
  capo.configs.accessibility,
];
```

### `ordering`

Element ordering validation only:

```javascript
import capo from 'eslint-plugin-capo';

export default [
  capo.configs.ordering,
];
```

### Custom Configuration

```javascript
import capo from 'eslint-plugin-capo';

export default [
  {
    plugins: {
      capo,
    },
    rules: {
      'capo/no-invalid-head-elements': 'error',
      'capo/require-title': 'error',
      'capo/no-duplicate-base': 'error',
      'capo/no-meta-csp': 'warn',
      'capo/no-invalid-http-equiv': 'warn',
      'capo/valid-meta-viewport': 'error',
      'capo/valid-charset': 'error',
      'capo/no-default-style': 'warn',
      'capo/head-element-order': 'warn', // Optional: validate element ordering
    },
  },
];
```

## Rules

### ✅ `no-invalid-head-elements`

Disallows invalid elements in the HTML `<head>`. Only allows: `base`, `link`, `meta`, `noscript`, `script`, `style`, `template`, `title`.

```html
<!-- ❌ Bad -->
<head>
  <div>Content</div>
  <span>Text</span>
</head>

<!-- ✅ Good -->
<head>
  <title>Page Title</title>
  <meta charset="utf-8">
</head>
```

### ✅ `require-title`

Requires exactly one `<title>` element in the `<head>`.

```html
<!-- ❌ Bad -->
<head>
  <!-- Missing title -->
</head>

<head>
  <title>First Title</title>
  <title>Second Title</title>
</head>

<!-- ✅ Good -->
<head>
  <title>Page Title</title>
</head>
```

### ✅ `no-duplicate-base`

Disallows multiple `<base>` elements.

```html
<!-- ❌ Bad -->
<head>
  <base href="https://example.com/">
  <base href="https://other.com/">
</head>

<!-- ✅ Good -->
<head>
  <base href="https://example.com/">
</head>
```

### 🚀 `no-meta-csp`

Disallows CSP meta tags that disable Chrome's preload scanner. Use HTTP headers instead.

```html
<!-- ❌ Bad -->
<head>
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
</head>

<!-- ✅ Good -->
<!-- Use CSP HTTP header instead -->
<!-- Content-Security-Policy: default-src 'self' -->
```

**Learn more:** [Chrome bug #1458493](https://crbug.com/1458493)

### ⚠️ `no-invalid-http-equiv`

Validates `http-equiv` meta tags and catches deprecated/non-standard values.

```html
<!-- ❌ Bad -->
<head>
  <!-- Deprecated IE features -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- Should use HTTP headers -->
  <meta http-equiv="Cache-Control" content="no-cache">
  
  <!-- Wrong attribute (should be name, not http-equiv) -->
  <meta http-equiv="description" content="Page description">
</head>

<!-- ✅ Good -->
<head>
  <meta name="description" content="Page description">
  <meta charset="utf-8">
</head>
```

### ♿ `valid-meta-viewport`

Ensures viewport meta tag is properly configured for accessibility.

```html
<!-- ❌ Bad -->
<head>
  <!-- Disables zooming (accessibility issue) -->
  <meta name="viewport" content="width=device-width, user-scalable=no">
  
  <!-- Invalid zoom limits -->
  <meta name="viewport" content="width=device-width, maximum-scale=1.0">
  
  <!-- Multiple viewport tags -->
  <meta name="viewport" content="width=device-width">
  <meta name="viewport" content="initial-scale=1">
</head>

<!-- ✅ Good -->
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
```

### ✅ `valid-charset`

Ensures proper UTF-8 character encoding is declared.

```html
<!-- ❌ Bad -->
<head>
  <meta charset="ISO-8859-1">
</head>

<head>
  <meta charset="utf-8">
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
</head>

<!-- ✅ Good -->
<head>
  <meta charset="utf-8">
</head>
```

### ⚠️ `no-default-style`

Discourages `default-style` meta tag (causes flash of unstyled content).

```html
<!-- ❌ Bad -->
<head>
  <meta http-equiv="default-style" content="main">
</head>

<!-- ✅ Good -->
<head>
  <!-- Use modern CSS features like @media rules instead -->
</head>
```

---

### 📊 `head-element-order`

**Type:** Suggestion  
**Category:** Performance  
**Recommended:** No (can be noisy, enable explicitly)  
**Default Severity:** warn

Validates that head elements are in optimal order for performance based on capo.js weight hierarchy.

#### Element Weight Hierarchy

| Weight | Element Type | Description |
|--------|--------------|-------------|
| 10 | META | Critical metadata (charset, viewport, CSP, origin-trial) |
| 9 | TITLE | Document title |
| 8 | PRECONNECT | Early connection hints |
| 7 | ASYNC_SCRIPT | Non-blocking async scripts |
| 6 | IMPORT_STYLES | CSS @import (blocks rendering) |
| 5 | SYNC_SCRIPT | Blocking synchronous scripts |
| 4 | SYNC_STYLES | Blocking stylesheets |
| 3 | PRELOAD | Resource preload hints |
| 2 | DEFER_SCRIPT | Deferred scripts and modules |
| 1 | PREFETCH_PRERENDER | Low priority prefetch/prerender |
| 0 | OTHER | Everything else |

#### Examples

❌ **Incorrect (bad ordering):**
```html
<head>
  <script src="/app.js" defer></script>  <!-- weight 2, too early -->
  <title>Page</title>                   <!-- weight 9, should be earlier -->
  <link rel="preload" href="/font.woff2" as="font">  <!-- weight 3 -->
  <meta charset="utf-8">                 <!-- weight 10, should be first -->
  <link rel="stylesheet" href="/styles.css">  <!-- weight 4 -->
</head>
```

✅ **Correct (optimal ordering):**
```html
<head>
  <!-- 1. META (weight 10) -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- 2. TITLE (weight 9) -->
  <title>Page</title>
  
  <!-- 3. PRECONNECT (weight 8) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  
  <!-- 4. ASYNC_SCRIPT (weight 7) -->
  <script src="/analytics.js" async></script>
  
  <!-- 5. SYNC_STYLES (weight 4) -->
  <link rel="stylesheet" href="/styles.css">
  
  <!-- 6. PRELOAD (weight 3) -->
  <link rel="preload" href="/font.woff2" as="font">
  
  <!-- 7. DEFER_SCRIPT (weight 2) -->
  <script src="/app.js" defer></script>
  
  <!-- 8. PREFETCH (weight 1) -->
  <link rel="prefetch" href="/next.html">
</head>
```

**Why ordering matters:**
- Critical metadata needs to be parsed first
- Early connection hints improve resource loading
- Proper ordering of render-blocking resources
- Deferred resources don't block initial render
- Low-priority hints come last

**Learn more:** [capo.js - Get your head in order](https://github.com/rviscomi/capo.js)

---

## Rule Severity

- `error` (🔴): Must be fixed
- `warn` (🟡): Should be fixed but won't fail CI

## Examples

### Bad HTML Head

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Missing charset -->
  <title>My Site</title>
  <title>Duplicate Title</title>
  
  <!-- CSP meta tag (disables preload scanner) -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
  
  <!-- Deprecated -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- Accessibility issue -->
  <meta name="viewport" content="width=device-width, user-scalable=no">
  
  <!-- Invalid element -->
  <div>Content</div>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

### Good HTML Head

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Site</title>
  <meta name="description" content="A well-structured page">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

## VS Code Setup

To enable real-time linting in VS Code:

1. **Install ESLint extension** (if not already installed)
2. **Create `.vscode/settings.json`:**
   ```json
   {
     "eslint.validate": ["html"]
   }
   ```
3. **Create `eslint.config.js`:**
   ```javascript
   import capo from 'eslint-plugin-capo';
   import htmlParser from '@html-eslint/parser';

   export default [
     {
       files: ['**/*.html'],
       languageOptions: {
         parser: htmlParser,
       },
     },
     capo.configs.recommended,
   ];
   ```
4. **Install dependencies:**
   ```bash
   npm install --save-dev eslint @html-eslint/parser eslint-plugin-capo
   ```

Now open any HTML file and see issues highlighted in real-time! 🎉

## Background

This plugin implements the validation rules from [capo.js](https://github.com/rviscomi/capo.js), a tool for determining the optimal order of elements in the HTML `<head>`. While capo.js focuses on ordering, this ESLint plugin focuses on validating that head elements are correct, accessible, and performant.

## Contributing

Contributions are welcome! Please open an issue or PR on [GitHub](https://github.com/rviscomi/eslint-plugin-capo).

## License

Apache-2.0

## Credits

Based on validation rules from [capo.js](https://github.com/rviscomi/capo.js) by [Rick Viscomi](https://github.com/rviscomi).

## Related Projects

- [capo.js](https://github.com/rviscomi/capo.js) - Get your `<head>` in order
- [eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html) - Lint HTML files
- [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) - ESLint plugin for Vue.js
