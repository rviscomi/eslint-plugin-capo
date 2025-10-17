# ESLint Plugin Capo - Project Overview

## 📋 Summary

A modern ESLint plugin that validates HTML `<head>` elements based on the battle-tested validation and ordering rules from [capo.js](https://github.com/rviscomi/capo.js). The plugin helps developers catch performance issues, accessibility problems, deprecated practices, and suboptimal element ordering in HTML head sections.

**Current Version: 1.1.0** - Now with element ordering validation!

## 🏗️ Project Structure

```
eslint-plugin-capo/
├── src/
│   ├── index.js                          # Main plugin entry with flat config
│   ├── rules/                            # ESLint rule implementations
│   │   ├── no-invalid-head-elements.js   # Validates allowed elements
│   │   ├── require-title.js              # Ensures single title element
│   │   ├── no-duplicate-base.js          # Prevents multiple base tags
│   │   ├── no-meta-csp.js                # Catches CSP performance issues
│   │   ├── no-invalid-http-equiv.js      # Validates http-equiv usage
│   │   ├── valid-meta-viewport.js        # Checks viewport accessibility
│   │   ├── valid-charset.js              # Ensures UTF-8 encoding
│   │   ├── no-default-style.js           # Discourages FOUC-causing tag
│   │   └── head-element-order.js         # 🆕 Validates optimal ordering
│   └── utils/
│       ├── validation-helpers.js         # Shared validation utilities
│       └── element-ordering.js           # 🆕 Element weight/ordering logic
├── examples/
│   ├── eslint.config.js                  # Example flat config
│   ├── bad-example.html                  # HTML with issues
│   ├── good-example.html                 # Properly structured HTML
│   ├── performance-example.html          # Performance-optimized HTML
│   ├── bad-ordering-example.html         # 🆕 Bad element ordering
│   └── optimal-ordering-example.html     # 🆕 Optimal element ordering
├── test/
│   └── test-plugin.js                    # Simple test runner
├── package.json                          # Package metadata
├── README.md                             # Complete documentation
├── RULES.md                              # Detailed rule reference
├── QUICKSTART.md                         # Quick start guide
├── ELEMENT_ORDERING.md                   # 🆕 Element ordering guide
├── CONTRIBUTING.md                       # Contribution guidelines
├── CHANGELOG.md                          # Version history
├── LICENSE                               # Apache 2.0 license
└── .gitignore                            # Git ignore rules
```

## ✨ Features

### 9 Validation Rules

1. **no-invalid-head-elements** - Only allows valid head elements (base, link, meta, noscript, script, style, template, title)
2. **require-title** - Requires exactly one `<title>` element
3. **no-duplicate-base** - Disallows multiple `<base>` elements
4. **no-meta-csp** - Catches CSP meta tags that disable Chrome's preload scanner
5. **no-invalid-http-equiv** - Validates http-equiv attributes (catches 20+ deprecated/misused values)
6. **valid-meta-viewport** - Ensures viewport is properly configured for accessibility
7. **valid-charset** - Requires UTF-8 encoding
8. **no-default-style** - Discourages default-style (causes FOUC)
9. **head-element-order** - 🆕 Validates optimal element ordering based on capo.js weight hierarchy

### 5 Configuration Presets

- **recommended** - Balanced rules for production (errors + warnings)
- **strict** - All rules as errors (includes ordering)
- **performance** - Performance-focused rules (includes ordering)
- **accessibility** - Accessibility-focused rules only
- **ordering** - 🆕 Just element ordering validation

## 🎯 Key Design Decisions

### Modern Flat Config Support
- ESLint 9+ compatible
- Uses new `plugins` object syntax
- Named configuration exports

### Comprehensive Validation + Ordering
Based on capo.js validation.js and rules.js:
- CSP meta tag detection
- http-equiv validation (20+ cases)
- Element weight hierarchy (11 types)
- Viewport accessibility checks
- Character encoding validation
- Deprecated IE features detection

### Framework Agnostic
Works with:
- Plain HTML (via eslint-plugin-html)
- Vue.js (via eslint-plugin-vue)
- React/Next.js (via custom file patterns)
- Any framework that generates HTML

## 🚀 Usage Examples

### Basic HTML Project
```javascript
import capo from 'eslint-plugin-capo';
import html from 'eslint-plugin-html';

export default [
  { files: ['**/*.html'], plugins: { html } },
  capo.configs.recommended,
];
```

### Vue.js Project
```javascript
import capo from 'eslint-plugin-capo';
import vue from 'eslint-plugin-vue';

export default [
  ...vue.configs['flat/recommended'],
  capo.configs.recommended,
];
```

### Next.js Project
```javascript
import capo from 'eslint-plugin-capo';

export default [
  {
    files: ['**/head.tsx', '**/layout.tsx', '**/_document.tsx'],
    ...capo.configs.recommended,
  },
];
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

This will:
1. Lint `bad-example.html` and report all issues found
2. Lint `good-example.html` and verify no issues
3. Display results with emoji indicators

## 📚 Documentation

- **README.md** - Complete user guide with examples
- **QUICKSTART.md** - Get started in 5 minutes
- **CONTRIBUTING.md** - Guidelines for contributors
- **CHANGELOG.md** - Version history

## 🔍 Validation Coverage

The plugin implements validation for:

### Performance Issues
- CSP meta tags (disable preload scanner)
- Unnecessary preloads
- Deprecated cache directives

### Accessibility Issues
- Viewport zoom restrictions
- Maximum scale limitations
- User-scalable disabled

### Standards Compliance
- Invalid head elements
- Character encoding (UTF-8 required)
- Duplicate declarations
- Deprecated IE features

### Deprecated Practices
- 20+ deprecated http-equiv values
- IE-specific meta tags
- Non-standard directives
- Wrong attribute types (name vs http-equiv)

## 🔗 Integration

### Build Tools
- Vite - ✅ Supported
- Webpack - ✅ Supported
- Parcel - ✅ Supported
- Any bundler with ESLint integration

### CI/CD
```yaml
- run: npm ci
- run: npx eslint .
```

### Frameworks
- Vue.js - ✅ Native support
- React - ✅ Via custom file patterns
- Next.js - ✅ Via custom file patterns
- Svelte - ✅ Native support
- Astro - ✅ Native support

## 📊 Rule Severity Levels

- **Error (🔴)** - Must be fixed:
  - Invalid head elements
  - Missing/duplicate title
  - Multiple base elements
  - CSP meta tags
  - Invalid charset
  - Viewport accessibility issues

- **Warning (🟡)** - Should be fixed:
  - Deprecated http-equiv values
  - Default-style usage

## 🎁 What's Included

1. ✅ 8 ESLint rules covering all capo.js validations
2. ✅ 4 preset configurations
3. ✅ Modern flat config support (ESLint 9+)
4. ✅ Comprehensive validation helpers
5. ✅ 3 example HTML files
6. ✅ Test suite
7. ✅ Complete documentation
8. ✅ Framework integration guides

## 🚦 Getting Started

```bash
# Install
npm install --save-dev eslint-plugin-capo eslint-plugin-html

# Create config
echo "import capo from 'eslint-plugin-capo';
import html from 'eslint-plugin-html';

export default [
  { files: ['**/*.html'], plugins: { html } },
  capo.configs.recommended,
];" > eslint.config.js

# Run
npx eslint .
```

## 📝 License

Apache-2.0

## 👏 Credits

Based on validation rules from [capo.js](https://github.com/rviscomi/capo.js) by Rick Viscomi.
