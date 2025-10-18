/**
 * @fileoverview Tests for element-ordering utilities
 * @author Rick Viscomi
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  ElementWeights,
  META_HTTP_EQUIV_KEYWORDS,
  isMeta,
  isTitle,
  isPreconnect,
  isAsyncScript,
  isImportStyles,
  isSyncScript,
  isSyncStyles,
  isPreload,
  isDeferScript,
  isPrefetchPrerender,
  getWeight,
  getElementTypeName,
  shouldComeBefore,
  getOptimalOrderDescription,
} from '../../src/utils/element-ordering.js';

describe('element-ordering', () => {
  describe('ElementWeights', () => {
    it('should have correct weight hierarchy', () => {
      assert.ok(ElementWeights.META > ElementWeights.TITLE);
      assert.ok(ElementWeights.TITLE > ElementWeights.PRECONNECT);
      assert.ok(ElementWeights.PRECONNECT > ElementWeights.ASYNC_SCRIPT);
      assert.ok(ElementWeights.ASYNC_SCRIPT > ElementWeights.IMPORT_STYLES);
      assert.ok(ElementWeights.IMPORT_STYLES > ElementWeights.SYNC_SCRIPT);
      assert.ok(ElementWeights.SYNC_SCRIPT > ElementWeights.SYNC_STYLES);
      assert.ok(ElementWeights.SYNC_STYLES > ElementWeights.PRELOAD);
      assert.ok(ElementWeights.PRELOAD > ElementWeights.DEFER_SCRIPT);
      assert.ok(ElementWeights.DEFER_SCRIPT > ElementWeights.PREFETCH_PRERENDER);
      assert.ok(ElementWeights.PREFETCH_PRERENDER > ElementWeights.OTHER);
    });
  });

  describe('isMeta', () => {
    it('should detect base elements', () => {
      const node = { name: 'base' };
      assert.strictEqual(isMeta(node), true);
    });

    it('should detect meta charset', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'charset' },
            value: { type: 'AttributeValue', value: 'utf-8' },
          },
        ],
      };
      assert.strictEqual(isMeta(node), true);
    });

    it('should detect meta viewport', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
        ],
      };
      assert.strictEqual(isMeta(node), true);
    });

    it('should detect high-priority http-equiv values', () => {
      META_HTTP_EQUIV_KEYWORDS.forEach((keyword) => {
        const node = {
          name: 'meta',
          attributes: [
            {
              key: { value: 'http-equiv' },
              value: { type: 'AttributeValue', value: keyword },
            },
          ],
        };
        assert.strictEqual(isMeta(node), true, `${keyword} should be detected as META`);
      });
    });

    it('should return false for low-priority meta tags', () => {
      const lowPriorityMetaTags = [
        'description',
        'keywords',
        'author',
        'theme-color',
        'color-scheme',
        'robots',
        'og:title',
        'og:description',
        'twitter:card',
        'application-name',
        'generator',
      ];

      lowPriorityMetaTags.forEach((metaName) => {
        const node = {
          name: 'meta',
          attributes: [
            {
              key: { value: 'name' },
              value: { type: 'AttributeValue', value: metaName },
            },
          ],
        };
        assert.strictEqual(isMeta(node), false, `${metaName} should NOT be treated as critical META`);
      });
    });

    it('should return false for low-priority http-equiv values', () => {
      const lowPriorityHttpEquiv = ['refresh', 'x-ua-compatible', 'expires', 'cache-control', 'pragma'];

      lowPriorityHttpEquiv.forEach((httpEquiv) => {
        const node = {
          name: 'meta',
          attributes: [
            {
              key: { value: 'http-equiv' },
              value: { type: 'AttributeValue', value: httpEquiv },
            },
          ],
        };
        assert.strictEqual(isMeta(node), false, `http-equiv="${httpEquiv}" should NOT be treated as critical META`);
      });
    });
  });

  describe('isTitle', () => {
    it('should detect title elements', () => {
      const node = { name: 'title' };
      assert.strictEqual(isTitle(node), true);
    });

    it('should return false for other elements', () => {
      const node = { name: 'meta' };
      assert.strictEqual(isTitle(node), false);
    });
  });

  describe('isPreconnect', () => {
    it('should detect preconnect links', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'preconnect' },
          },
        ],
      };
      assert.strictEqual(isPreconnect(node), true);
    });

    it('should be case-insensitive', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'Preconnect' },
          },
        ],
      };
      assert.strictEqual(isPreconnect(node), true);
    });

    it('should return false for other link types', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'stylesheet' },
          },
        ],
      };
      assert.strictEqual(isPreconnect(node), false);
    });

    it('should return false for non-link elements', () => {
      const node = { name: 'script' };
      assert.strictEqual(isPreconnect(node), false);
    });
  });

  describe('isAsyncScript', () => {
    it('should detect async scripts', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'src' },
            value: { type: 'AttributeValue', value: 'app.js' },
          },
          {
            key: { value: 'async' },
            value: { type: 'AttributeValue', value: '' },
          },
        ],
      };
      assert.strictEqual(isAsyncScript(node), true);
    });

    it('should return false for scripts without src', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'async' },
            value: { type: 'AttributeValue', value: '' },
          },
        ],
      };
      assert.strictEqual(isAsyncScript(node), false);
    });

    it('should return false for scripts without async', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'src' },
            value: { type: 'AttributeValue', value: 'app.js' },
          },
        ],
      };
      assert.strictEqual(isAsyncScript(node), false);
    });
  });

  describe('isImportStyles', () => {
    it('should detect @import in style tags', () => {
      const node = {
        name: 'style',
        type: 'StyleTag',
        children: [
          {
            type: 'VText',
            value: "@import url('fonts.css');",
          },
        ],
      };
      assert.strictEqual(isImportStyles(node), true);
    });

    it('should return false for styles without @import', () => {
      const node = {
        name: 'style',
        type: 'StyleTag',
        children: [
          {
            type: 'VText',
            value: 'body { margin: 0; }',
          },
        ],
      };
      assert.strictEqual(isImportStyles(node), false);
    });

    it('should return false for non-style elements', () => {
      const node = { name: 'link' };
      assert.strictEqual(isImportStyles(node), false);
    });
  });

  describe('isSyncScript', () => {
    it('should detect synchronous external scripts', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'src' },
            value: { type: 'AttributeValue', value: 'app.js' },
          },
        ],
      };
      assert.strictEqual(isSyncScript(node), true);
    });

    it('should detect inline scripts as sync', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [],
      };
      assert.strictEqual(isSyncScript(node), true);
    });

    it('should return false for defer scripts', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'src' },
            value: { type: 'AttributeValue', value: 'app.js' },
          },
          {
            key: { value: 'defer' },
            value: { type: 'AttributeValue', value: '' },
          },
        ],
      };
      assert.strictEqual(isSyncScript(node), false);
    });

    it('should return false for async scripts', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'src' },
            value: { type: 'AttributeValue', value: 'app.js' },
          },
          {
            key: { value: 'async' },
            value: { type: 'AttributeValue', value: '' },
          },
        ],
      };
      assert.strictEqual(isSyncScript(node), false);
    });

    it('should return false for module scripts', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'src' },
            value: { type: 'AttributeValue', value: 'app.js' },
          },
          {
            key: { value: 'type' },
            value: { type: 'AttributeValue', value: 'module' },
          },
        ],
      };
      assert.strictEqual(isSyncScript(node), false);
    });

    it('should return false for JSON scripts', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'src' },
            value: { type: 'AttributeValue', value: 'data.json' },
          },
          {
            key: { value: 'type' },
            value: { type: 'AttributeValue', value: 'application/json' },
          },
        ],
      };
      assert.strictEqual(isSyncScript(node), false);
    });
  });

  describe('isSyncStyles', () => {
    it('should detect style elements', () => {
      const node = {
        name: 'style',
        type: 'StyleTag',
      };
      assert.strictEqual(isSyncStyles(node), true);
    });

    it('should detect stylesheet links', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'stylesheet' },
          },
        ],
      };
      assert.strictEqual(isSyncStyles(node), true);
    });

    it('should return false for other link types', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'preload' },
          },
        ],
      };
      assert.strictEqual(isSyncStyles(node), false);
    });
  });

  describe('isPreload', () => {
    it('should detect preload links', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'preload' },
          },
        ],
      };
      assert.strictEqual(isPreload(node), true);
    });

    it('should detect modulepreload links', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'modulepreload' },
          },
        ],
      };
      assert.strictEqual(isPreload(node), true);
    });

    it('should return false for other link types', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'stylesheet' },
          },
        ],
      };
      assert.strictEqual(isPreload(node), false);
    });
  });

  describe('isDeferScript', () => {
    it('should detect defer scripts', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'src' },
            value: { type: 'AttributeValue', value: 'app.js' },
          },
          {
            key: { value: 'defer' },
            value: { type: 'AttributeValue', value: '' },
          },
        ],
      };
      assert.strictEqual(isDeferScript(node), true);
    });

    it('should detect module scripts without async as defer', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'src' },
            value: { type: 'AttributeValue', value: 'app.js' },
          },
          {
            key: { value: 'type' },
            value: { type: 'AttributeValue', value: 'module' },
          },
        ],
      };
      assert.strictEqual(isDeferScript(node), true);
    });

    it('should return false for inline scripts', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [],
      };
      assert.strictEqual(isDeferScript(node), false);
    });

    it('should return false for sync scripts', () => {
      const node = {
        name: 'script',
        type: 'ScriptTag',
        attributes: [
          {
            key: { value: 'src' },
            value: { type: 'AttributeValue', value: 'app.js' },
          },
        ],
      };
      assert.strictEqual(isDeferScript(node), false);
    });
  });

  describe('isPrefetchPrerender', () => {
    it('should detect prefetch links', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'prefetch' },
          },
        ],
      };
      assert.strictEqual(isPrefetchPrerender(node), true);
    });

    it('should detect dns-prefetch links', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'dns-prefetch' },
          },
        ],
      };
      assert.strictEqual(isPrefetchPrerender(node), true);
    });

    it('should detect prerender links', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'prerender' },
          },
        ],
      };
      assert.strictEqual(isPrefetchPrerender(node), true);
    });

    it('should return false for other link types', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'stylesheet' },
          },
        ],
      };
      assert.strictEqual(isPrefetchPrerender(node), false);
    });
  });

  describe('getWeight', () => {
    it('should return correct weight for each element type', () => {
      const metaNode = { name: 'base' };
      assert.strictEqual(getWeight(metaNode), ElementWeights.META);

      const titleNode = { name: 'title' };
      assert.strictEqual(getWeight(titleNode), ElementWeights.TITLE);

      const preconnectNode = {
        name: 'link',
        attributes: [{ key: { value: 'rel' }, value: { type: 'AttributeValue', value: 'preconnect' } }],
      };
      assert.strictEqual(getWeight(preconnectNode), ElementWeights.PRECONNECT);

      const otherNode = {
        name: 'meta',
        attributes: [{ key: { value: 'name' }, value: { type: 'AttributeValue', value: 'description' } }],
      };
      assert.strictEqual(getWeight(otherNode), ElementWeights.OTHER);
    });

    it('should assign OTHER weight to non-critical meta tags', () => {
      const nonCriticalMetaTags = [
        'description',
        'keywords',
        'author',
        'theme-color',
        'robots',
        'og:title',
        'twitter:card',
      ];

      nonCriticalMetaTags.forEach((metaName) => {
        const node = {
          name: 'meta',
          attributes: [
            {
              key: { value: 'name' },
              value: { type: 'AttributeValue', value: metaName },
            },
          ],
        };
        assert.strictEqual(
          getWeight(node),
          ElementWeights.OTHER,
          `${metaName} should have OTHER weight, not META weight`
        );
      });
    });

    it('should assign META weight only to critical meta tags', () => {
      const criticalMetaTags = [
        { name: 'base' },
        {
          name: 'meta',
          attributes: [{ key: { value: 'charset' }, value: { type: 'AttributeValue', value: 'utf-8' } }],
        },
        {
          name: 'meta',
          attributes: [{ key: { value: 'name' }, value: { type: 'AttributeValue', value: 'viewport' } }],
        },
        {
          name: 'meta',
          attributes: [
            {
              key: { value: 'http-equiv' },
              value: { type: 'AttributeValue', value: 'content-security-policy' },
            },
          ],
        },
        {
          name: 'meta',
          attributes: [{ key: { value: 'http-equiv' }, value: { type: 'AttributeValue', value: 'origin-trial' } }],
        },
      ];

      criticalMetaTags.forEach((node) => {
        assert.strictEqual(
          getWeight(node),
          ElementWeights.META,
          `Critical meta tag should have META weight: ${JSON.stringify(node)}`
        );
      });
    });
  });

  describe('getElementTypeName', () => {
    it('should return correct type name for each element', () => {
      const metaNode = { name: 'base' };
      assert.strictEqual(getElementTypeName(metaNode), 'META');

      const titleNode = { name: 'title' };
      assert.strictEqual(getElementTypeName(titleNode), 'TITLE');

      const preconnectNode = {
        name: 'link',
        attributes: [{ key: { value: 'rel' }, value: { type: 'AttributeValue', value: 'preconnect' } }],
      };
      assert.strictEqual(getElementTypeName(preconnectNode), 'PRECONNECT');

      const otherNode = {
        name: 'meta',
        attributes: [{ key: { value: 'name' }, value: { type: 'AttributeValue', value: 'description' } }],
      };
      assert.strictEqual(getElementTypeName(otherNode), 'OTHER');
    });
  });

  describe('shouldComeBefore', () => {
    it('should determine correct ordering', () => {
      const metaNode = { name: 'base' };
      const titleNode = { name: 'title' };
      const otherNode = {
        name: 'meta',
        attributes: [{ key: { value: 'name' }, value: { type: 'AttributeValue', value: 'description' } }],
      };

      assert.strictEqual(shouldComeBefore(metaNode, titleNode), true);
      assert.strictEqual(shouldComeBefore(titleNode, metaNode), false);
      assert.strictEqual(shouldComeBefore(metaNode, otherNode), true);
      assert.strictEqual(shouldComeBefore(otherNode, metaNode), false);
    });
  });

  describe('getOptimalOrderDescription', () => {
    it('should return array of ordering descriptions', () => {
      const descriptions = getOptimalOrderDescription();
      assert.ok(Array.isArray(descriptions));
      assert.ok(descriptions.length > 0);
      assert.ok(descriptions[0].includes('META'));
    });
  });
});
