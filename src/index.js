/**
 * ESLint Plugin Capo
 * Validates HTML <head> elements based on capo.js rules
 * https://github.com/rviscomi/capo.js
 */

import noInvalidHeadElements from './rules/no-invalid-head-elements.js';
import requireTitle from './rules/require-title.js';
import noDuplicateBase from './rules/no-duplicate-base.js';
import noMetaCSP from './rules/no-meta-csp.js';
import noInvalidHttpEquiv from './rules/no-invalid-http-equiv.js';
import validMetaViewport from './rules/valid-meta-viewport.js';
import validCharset from './rules/valid-charset.js';
import noDefaultStyle from './rules/no-default-style.js';
import headElementOrder from './rules/head-element-order.js';

const plugin = {
  meta: {
    name: 'eslint-plugin-capo',
    version: '1.1.0',
  },
  
  rules: {
    'no-invalid-head-elements': noInvalidHeadElements,
    'require-title': requireTitle,
    'no-duplicate-base': noDuplicateBase,
    'no-meta-csp': noMetaCSP,
    'no-invalid-http-equiv': noInvalidHttpEquiv,
    'valid-meta-viewport': validMetaViewport,
    'valid-charset': validCharset,
    'no-default-style': noDefaultStyle,
    'head-element-order': headElementOrder,
  },
  
  configs: {},
};

// Recommended config for flat config format
plugin.configs.recommended = {
  name: 'capo/recommended',
  plugins: {
    capo: plugin,
  },
  rules: {
    'capo/no-invalid-head-elements': 'error',
    'capo/require-title': 'error',
    'capo/no-duplicate-base': 'error',
    'capo/no-meta-csp': 'error',
    'capo/no-invalid-http-equiv': 'warn',
    'capo/valid-meta-viewport': 'error',
    'capo/valid-charset': 'error',
    'capo/no-default-style': 'warn',
  },
};

// Strict config (all rules as errors)
plugin.configs.strict = {
  name: 'capo/strict',
  plugins: {
    capo: plugin,
  },
  rules: {
    'capo/no-invalid-head-elements': 'error',
    'capo/require-title': 'error',
    'capo/no-duplicate-base': 'error',
    'capo/no-meta-csp': 'error',
    'capo/no-invalid-http-equiv': 'error',
    'capo/valid-meta-viewport': 'error',
    'capo/valid-charset': 'error',
    'capo/no-default-style': 'error',
    'capo/head-element-order': 'error',
  },
};

// Performance-focused config
plugin.configs.performance = {
  name: 'capo/performance',
  plugins: {
    capo: plugin,
  },
  rules: {
    'capo/no-meta-csp': 'error',
    'capo/no-invalid-http-equiv': 'warn',
    'capo/head-element-order': 'warn',
  },
};

// Accessibility-focused config
plugin.configs.accessibility = {
  name: 'capo/accessibility',
  plugins: {
    capo: plugin,
  },
  rules: {
    'capo/valid-meta-viewport': 'error',
  },
};

// Ordering-focused config (just element order validation)
plugin.configs.ordering = {
  name: 'capo/ordering',
  plugins: {
    capo: plugin,
  },
  rules: {
    'capo/head-element-order': 'warn',
  },
};

export default plugin;
