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

export default [...vue.configs['flat/recommended'], capo.configs.recommended];
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

export default [capo.configs.recommended];
```

### `strict`

All rules as errors:

```javascript
import capo from 'eslint-plugin-capo';

export default [capo.configs.strict];
```

### `performance`

Performance-focused rules only:

```javascript
import capo from 'eslint-plugin-capo';

export default [capo.configs.performance];
```

### `accessibility`

Accessibility-focused rules only:

```javascript
import capo from 'eslint-plugin-capo';

export default [capo.configs.accessibility];
```

### `ordering`

Element ordering validation only:

```javascript
import capo from 'eslint-plugin-capo';

export default [capo.configs.ordering];
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

## Background

This plugin implements the validation rules from [capo.js](https://github.com/rviscomi/capo.js), a tool for determining the optimal order of elements in the HTML `<head>`. While capo.js focuses on ordering, this ESLint plugin focuses on validating that head elements are correct, accessible, and performant.

## Contributing

Contributions are welcome! Please open an issue or PR on [GitHub](https://github.com/rviscomi/eslint-plugin-capo).

## License

Apache-2.0

## Credits

Based on validation rules from [capo.js](https://github.com/rviscomi/capo.js) by [Rick Viscomi](https://github.com/rviscomi).
Inspired by [Harry Roberts'](https://twitter.com/csswizardry) work on [ct.css](https://csswizardry.com/ct/) and [Vitaly Friedman's](https://twitter.com/smashingmag) [Nordic.js 2022 presentation](https://youtu.be/uqLl-Yew2o8?t=2873).
