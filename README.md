# eslint-plugin-capo

ESLint plugin to validate HTML `<head>` elements based on [capo.js](https://github.com/rviscomi/capo.js) validation rules. This plugin helps catch common issues with metadata, performance problems, accessibility concerns, and deprecated practices in HTML head sections.

## Installation

```bash
npm install --save-dev eslint-plugin-capo @html-eslint/parser
```

**Requirements:**

- ESLint >= 8.21.0
- Node.js >= 18.18.0
- `@html-eslint/parser` >= 0.47.0

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

## Configuration Presets

See the [rules documentation](docs/rules/README.md) for more information.

### `recommended` (Default)

Balanced rules for production use:

```javascript
import capo from 'eslint-plugin-capo';

export default [capo.configs.recommended];
```

### Other presets

Besides than the recommended preset, there are other presets available:

- `strict` - All rules as errors
- `performance` - Performance-focused rules only
- `accessibility` - Accessibility-focused rules only
- `ordering` - Element ordering validation only

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
      'capo/no-unnecessary-preload': 'warn',
      'capo/require-order': 'warn', // Optional: validate element ordering
    },
  },
];
```

## Background

This plugin implements the validation rules from [capo.js](https://github.com/rviscomi/capo.js), a tool for determining the optimal order of elements in the HTML `<head>`.

## Contributing

Contributions are welcome! Please open an issue or PR on [GitHub](https://github.com/rviscomi/eslint-plugin-capo).

## License

Apache-2.0

## Credits

Based on validation rules from [capo.js](https://github.com/rviscomi/capo.js) by [Rick Viscomi](https://github.com/rviscomi).
Inspired by [Harry Roberts'](https://twitter.com/csswizardry) work on [ct.css](https://csswizardry.com/ct/) and [Vitaly Friedman's](https://twitter.com/smashingmag) [Nordic.js 2022 presentation](https://youtu.be/uqLl-Yew2o8?t=2873).
