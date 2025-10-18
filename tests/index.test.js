/**
 * @fileoverview Tests for main plugin index
 * @author Rick Viscomi
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import plugin from '../src/index.js';

describe('eslint-plugin-capo', () => {
  describe('plugin metadata', () => {
    it('should have correct metadata', () => {
      assert.ok(plugin.meta);
      assert.strictEqual(plugin.meta.name, 'eslint-plugin-capo');
      assert.ok(plugin.meta.version);
    });
  });

  describe('plugin rules', () => {
    it('should export all rules', () => {
      assert.ok(plugin.rules);
      const expectedRules = [
        'no-invalid-head-elements',
        'require-title',
        'no-duplicate-title',
        'no-duplicate-base',
        'no-meta-csp',
        'no-invalid-http-equiv',
        'no-invalid-origin-trial',
        'require-meta-viewport',
        'valid-meta-viewport',
        'valid-charset',
        'no-default-style',
        'no-unnecessary-preload',
        'require-order',
      ];

      expectedRules.forEach((ruleName) => {
        assert.ok(plugin.rules[ruleName], `Rule ${ruleName} should exist`);
        assert.ok(plugin.rules[ruleName].meta, `Rule ${ruleName} should have meta`);
        assert.ok(plugin.rules[ruleName].create, `Rule ${ruleName} should have create function`);
      });
    });

    it('should have correct rule count', () => {
      const ruleCount = Object.keys(plugin.rules).length;
      assert.strictEqual(ruleCount, 13, 'Should have 13 rules');
    });
  });

  describe('plugin configs', () => {
    it('should export configs object', () => {
      assert.ok(plugin.configs);
    });

    describe('recommended config', () => {
      it('should exist', () => {
        assert.ok(plugin.configs.recommended);
      });

      it('should have correct structure', () => {
        const config = plugin.configs.recommended;
        assert.strictEqual(config.name, 'capo/recommended');
        assert.ok(config.plugins);
        assert.ok(config.plugins.capo);
        assert.ok(config.rules);
      });

      it('should enable core validation rules as errors', () => {
        const config = plugin.configs.recommended;
        assert.strictEqual(config.rules['capo/no-invalid-head-elements'], 'error');
        assert.strictEqual(config.rules['capo/require-title'], 'error');
        assert.strictEqual(config.rules['capo/no-duplicate-title'], 'error');
        assert.strictEqual(config.rules['capo/no-duplicate-base'], 'error');
        assert.strictEqual(config.rules['capo/no-meta-csp'], 'error');
        assert.strictEqual(config.rules['capo/valid-meta-viewport'], 'error');
        assert.strictEqual(config.rules['capo/valid-charset'], 'error');
      });

      it('should enable advisory rules as warnings', () => {
        const config = plugin.configs.recommended;
        assert.strictEqual(config.rules['capo/no-invalid-http-equiv'], 'warn');
        assert.strictEqual(config.rules['capo/require-meta-viewport'], 'warn');
        assert.strictEqual(config.rules['capo/no-default-style'], 'warn');
      });

      it('should not enable require-order by default', () => {
        const config = plugin.configs.recommended;
        assert.strictEqual(config.rules['capo/require-order'], undefined);
      });
    });

    describe('strict config', () => {
      it('should exist', () => {
        assert.ok(plugin.configs.strict);
      });

      it('should have correct structure', () => {
        const config = plugin.configs.strict;
        assert.strictEqual(config.name, 'capo/strict');
        assert.ok(config.plugins);
        assert.ok(config.plugins.capo);
        assert.ok(config.rules);
      });

      it('should enable all rules as errors', () => {
        const config = plugin.configs.strict;
        const expectedRules = [
          'no-invalid-head-elements',
          'require-title',
          'no-duplicate-title',
          'no-duplicate-base',
          'no-meta-csp',
          'no-invalid-http-equiv',
          'require-meta-viewport',
          'valid-meta-viewport',
          'valid-charset',
          'no-default-style',
          'require-order',
        ];

        expectedRules.forEach((ruleName) => {
          assert.strictEqual(
            config.rules[`capo/${ruleName}`],
            'error',
            `Rule capo/${ruleName} should be 'error' in strict config`
          );
        });
      });
    });

    describe('performance config', () => {
      it('should exist', () => {
        assert.ok(plugin.configs.performance);
      });

      it('should have correct structure', () => {
        const config = plugin.configs.performance;
        assert.strictEqual(config.name, 'capo/performance');
        assert.ok(config.plugins);
        assert.ok(config.rules);
      });

      it('should enable performance-related rules', () => {
        const config = plugin.configs.performance;
        assert.strictEqual(config.rules['capo/no-meta-csp'], 'error');
        assert.strictEqual(config.rules['capo/no-invalid-http-equiv'], 'warn');
        assert.strictEqual(config.rules['capo/require-order'], 'warn');
      });
    });

    describe('accessibility config', () => {
      it('should exist', () => {
        assert.ok(plugin.configs.accessibility);
      });

      it('should have correct structure', () => {
        const config = plugin.configs.accessibility;
        assert.strictEqual(config.name, 'capo/accessibility');
        assert.ok(config.plugins);
        assert.ok(config.rules);
      });

      it('should enable accessibility-related rules', () => {
        const config = plugin.configs.accessibility;
        assert.strictEqual(config.rules['capo/require-meta-viewport'], 'error');
        assert.strictEqual(config.rules['capo/valid-meta-viewport'], 'error');
      });
    });

    describe('ordering config', () => {
      it('should exist', () => {
        assert.ok(plugin.configs.ordering);
      });

      it('should have correct structure', () => {
        const config = plugin.configs.ordering;
        assert.strictEqual(config.name, 'capo/ordering');
        assert.ok(config.plugins);
        assert.ok(config.rules);
      });

      it('should enable only require-order rule', () => {
        const config = plugin.configs.ordering;
        assert.strictEqual(config.rules['capo/require-order'], 'warn');

        // Ensure no other rules are enabled
        const enabledRules = Object.keys(config.rules);
        assert.strictEqual(enabledRules.length, 1);
      });
    });
  });

  describe('plugin integration', () => {
    it('should be usable as a plugin', () => {
      // Verify the plugin can be used in a flat config
      const flatConfig = {
        plugins: {
          capo: plugin,
        },
        rules: {
          'capo/require-title': 'error',
        },
      };

      assert.ok(flatConfig.plugins.capo);
      assert.ok(flatConfig.plugins.capo.rules);
    });

    it('should allow config spreading', () => {
      // Verify configs can be spread into user config
      const userConfig = {
        ...plugin.configs.recommended,
        rules: {
          ...plugin.configs.recommended.rules,
          'capo/require-title': 'warn', // Override
        },
      };

      assert.strictEqual(userConfig.rules['capo/require-title'], 'warn');
      assert.strictEqual(userConfig.rules['capo/no-duplicate-base'], 'error');
    });
  });

  describe('rule metadata validation', () => {
    it('all rules should have required metadata', () => {
      Object.entries(plugin.rules).forEach(([ruleName, ruleModule]) => {
        assert.ok(ruleModule.meta, `Rule ${ruleName} should have meta`);
        assert.ok(ruleModule.meta.type, `Rule ${ruleName} should have type`);
        assert.ok(ruleModule.meta.docs, `Rule ${ruleName} should have docs`);
        assert.ok(ruleModule.meta.docs.description, `Rule ${ruleName} should have description`);
        assert.ok(ruleModule.meta.messages, `Rule ${ruleName} should have messages`);
      });
    });

    it('all rules should have consistent docs URLs', () => {
      Object.entries(plugin.rules).forEach(([ruleName, ruleModule]) => {
        if (ruleModule.meta.docs.url) {
          assert.ok(ruleModule.meta.docs.url.includes(ruleName), `Rule ${ruleName} docs URL should include rule name`);
        }
      });
    });

    it('problem rules should have appropriate fixability', () => {
      Object.entries(plugin.rules).forEach(([ruleName, ruleModule]) => {
        if (ruleModule.meta.type === 'problem') {
          // Problem rules typically don't have fixable: true
          // They may have suggestions instead
          if (ruleModule.meta.fixable) {
            // If fixable, it should be 'code' or 'whitespace'
            assert.ok(['code', 'whitespace'].includes(ruleModule.meta.fixable));
          }
        }
      });
    });
  });

  describe('default export', () => {
    it('should export plugin as default', () => {
      assert.ok(plugin);
      assert.strictEqual(typeof plugin, 'object');
    });

    it('should be compatible with ESM import patterns', () => {
      // Verify the plugin structure supports various import patterns
      assert.ok(plugin.rules);
      assert.ok(plugin.configs);
      assert.ok(plugin.meta);
    });
  });
});
