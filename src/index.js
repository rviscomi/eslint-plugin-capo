/**
 * ESLint Plugin Capo
 * Validates HTML <head> elements based on capo.js rules
 * https://github.com/rviscomi/capo.js
 */

import noDefaultStyle from './rules/no-default-style.js';
import noDuplicateBase from './rules/no-duplicate-base.js';
import noDuplicateTitle from './rules/no-duplicate-title.js';
import noInvalidHeadElements from './rules/no-invalid-head-elements.js';
import noInvalidHttpEquiv from './rules/no-invalid-http-equiv.js';
import noInvalidOriginTrial from './rules/no-invalid-origin-trial.js';
import noMetaCSP from './rules/no-meta-csp.js';
import noUnnecessaryPreload from './rules/no-unnecessary-preload.js';
import requireMetaViewport from './rules/require-meta-viewport.js';
import requireOrder from './rules/require-order.js';
import requireTitle from './rules/require-title.js';
import validCharset from './rules/valid-charset.js';
import validMetaViewport from './rules/valid-meta-viewport.js';

const rules = {
  'no-default-style': noDefaultStyle,
  'no-duplicate-base': noDuplicateBase,
  'no-duplicate-title': noDuplicateTitle,
  'no-invalid-head-elements': noInvalidHeadElements,
  'no-invalid-http-equiv': noInvalidHttpEquiv,
  'no-invalid-origin-trial': noInvalidOriginTrial,
  'no-meta-csp': noMetaCSP,
  'no-unnecessary-preload': noUnnecessaryPreload,
  'require-meta-viewport': requireMetaViewport,
  'require-order': requireOrder,
  'require-title': requireTitle,
  'valid-charset': validCharset,
  'valid-meta-viewport': validMetaViewport,
};

const allRules = Object.fromEntries(
  Object.keys(rules)
    .filter((ruleName) => !['no-invalid-origin-trial', 'no-unnecessary-preload'].includes(ruleName))
    .map((ruleName) => [`capo/${ruleName}`, 'error'])
);

const recommendedRules = {
  'capo/no-invalid-head-elements': 'error',
  'capo/require-title': 'error',
  'capo/no-duplicate-title': 'error',
  'capo/no-duplicate-base': 'error',
  'capo/no-meta-csp': 'error',
  'capo/valid-meta-viewport': 'error',
  'capo/valid-charset': 'error',
  'capo/no-invalid-http-equiv': 'warn',
  'capo/require-meta-viewport': 'warn',
  'capo/no-default-style': 'warn',
};

const performanceRules = {
  'capo/no-meta-csp': 'error',
  'capo/no-invalid-http-equiv': 'warn',
  'capo/require-order': 'warn',
};

const accessibilityRules = {
  'capo/require-meta-viewport': 'error',
  'capo/valid-meta-viewport': 'error',
};

const orderingRules = {
  'capo/require-order': 'warn',
};

const configs = {
  recommended: {
    name: 'capo/recommended',
    plugins: { capo: { rules } },
    rules: recommendedRules,
  },
  strict: {
    name: 'capo/strict',
    plugins: { capo: { rules } },
    rules: allRules,
  },
  performance: {
    name: 'capo/performance',
    plugins: { capo: { rules } },
    rules: performanceRules,
  },
  accessibility: {
    name: 'capo/accessibility',
    plugins: { capo: { rules } },
    rules: accessibilityRules,
  },
  ordering: {
    name: 'capo/ordering',
    plugins: { capo: { rules } },
    rules: orderingRules,
  },
};

const plugin = {
  meta: {
    name: 'eslint-plugin-capo',
    version: '0.1.0',
  },
  rules,
  configs,
};

export default plugin;
