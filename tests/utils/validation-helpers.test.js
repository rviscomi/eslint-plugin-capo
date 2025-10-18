/**
 * @fileoverview Tests for validation-helpers utilities
 * @author Rick Viscomi
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  VALID_HEAD_ELEMENTS,
  isValidHeadElement,
  isMetaCSP,
  isOriginTrial,
  isMetaViewport,
  isDefaultStyle,
  isContentType,
  isHttpEquiv,
  isPreload,
  getAttributeValue,
  validateCSP,
  VALID_HTTP_EQUIV_VALUES,
  isValidHttpEquiv,
  validateHttpEquiv,
  validateMetaViewport,
  validateContentType,
  validateDefaultStyle,
} from '../../src/utils/validation-helpers.js';

describe('validation-helpers', () => {
  describe('isValidHeadElement', () => {
    it('should return true for valid head elements', () => {
      const validElements = ['base', 'link', 'meta', 'noscript', 'script', 'style', 'template', 'title'];
      validElements.forEach((el) => {
        assert.strictEqual(isValidHeadElement(el), true, `${el} should be valid`);
      });
    });

    it('should return false for invalid head elements', () => {
      const invalidElements = ['div', 'span', 'p', 'h1', 'body', 'html'];
      invalidElements.forEach((el) => {
        assert.strictEqual(isValidHeadElement(el), false, `${el} should be invalid`);
      });
    });

    it('should be case-insensitive', () => {
      assert.strictEqual(isValidHeadElement('TITLE'), true);
      assert.strictEqual(isValidHeadElement('Title'), true);
      assert.strictEqual(isValidHeadElement('DIV'), false);
    });
  });

  describe('getAttributeValue', () => {
    it('should get attribute value from @html-eslint/parser format', () => {
      const node = {
        attributes: [
          {
            key: { value: 'charset' },
            value: { type: 'AttributeValue', value: 'utf-8' },
          },
        ],
      };
      assert.strictEqual(getAttributeValue(node, 'charset'), 'utf-8');
    });

    it('should be case-insensitive for attribute names', () => {
      const node = {
        attributes: [
          {
            key: { value: 'CHARSET' },
            value: { type: 'AttributeValue', value: 'utf-8' },
          },
        ],
      };
      assert.strictEqual(getAttributeValue(node, 'charset'), 'utf-8');
    });

    it('should return null if attribute not found', () => {
      const node = {
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
        ],
      };
      assert.strictEqual(getAttributeValue(node, 'charset'), null);
    });

    it('should return null if node has no attributes', () => {
      const node = {};
      assert.strictEqual(getAttributeValue(node, 'charset'), null);
    });

    it('should return null if attribute value type is not AttributeValue', () => {
      const node = {
        attributes: [
          {
            key: { value: 'charset' },
            value: { type: 'UnknownType', value: 'utf-8' },
          },
        ],
      };
      assert.strictEqual(getAttributeValue(node, 'charset'), null);
    });
  });

  describe('isMetaCSP', () => {
    it('should detect CSP meta tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'Content-Security-Policy' },
          },
        ],
      };
      assert.strictEqual(isMetaCSP(node), true);
    });

    it('should detect CSP Report-Only meta tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'Content-Security-Policy-Report-Only' },
          },
        ],
      };
      assert.strictEqual(isMetaCSP(node), true);
    });

    it('should be case-insensitive', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'content-security-policy' },
          },
        ],
      };
      assert.strictEqual(isMetaCSP(node), true);
    });

    it('should return false for non-CSP meta tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
        ],
      };
      assert.strictEqual(isMetaCSP(node), false);
    });

    it('should return false for non-meta elements', () => {
      const node = { name: 'link' };
      assert.strictEqual(isMetaCSP(node), false);
    });
  });

  describe('isOriginTrial', () => {
    it('should detect origin-trial meta tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'origin-trial' },
          },
        ],
      };
      assert.strictEqual(isOriginTrial(node), true);
    });

    it('should be case-insensitive', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'Origin-Trial' },
          },
        ],
      };
      assert.strictEqual(isOriginTrial(node), true);
    });

    it('should return false for non-origin-trial tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'refresh' },
          },
        ],
      };
      assert.strictEqual(isOriginTrial(node), false);
    });
  });

  describe('isMetaViewport', () => {
    it('should detect viewport meta tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
        ],
      };
      assert.strictEqual(isMetaViewport(node), true);
    });

    it('should be case-insensitive', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'Viewport' },
          },
        ],
      };
      assert.strictEqual(isMetaViewport(node), true);
    });

    it('should return false for non-viewport meta tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'description' },
          },
        ],
      };
      assert.strictEqual(isMetaViewport(node), false);
    });
  });

  describe('isDefaultStyle', () => {
    it('should detect default-style meta tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'default-style' },
          },
        ],
      };
      assert.strictEqual(isDefaultStyle(node), true);
    });

    it('should be case-insensitive', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'Default-Style' },
          },
        ],
      };
      assert.strictEqual(isDefaultStyle(node), true);
    });
  });

  describe('isContentType', () => {
    it('should detect meta charset tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'charset' },
            value: { type: 'AttributeValue', value: 'utf-8' },
          },
        ],
      };
      assert.strictEqual(isContentType(node), true);
    });

    it('should detect content-type http-equiv tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'content-type' },
          },
        ],
      };
      assert.strictEqual(isContentType(node), true);
    });

    it('should return false for other meta tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
        ],
      };
      assert.strictEqual(isContentType(node), false);
    });
  });

  describe('isHttpEquiv', () => {
    it('should detect meta tags with http-equiv attribute', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'refresh' },
          },
        ],
      };
      assert.strictEqual(isHttpEquiv(node), true);
    });

    it('should return false for meta tags without http-equiv', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
        ],
      };
      assert.strictEqual(isHttpEquiv(node), false);
    });

    it('should return false for non-meta elements', () => {
      const node = { name: 'link' };
      assert.strictEqual(isHttpEquiv(node), false);
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

    it('should be case-insensitive', () => {
      const node = {
        name: 'link',
        attributes: [
          {
            key: { value: 'rel' },
            value: { type: 'AttributeValue', value: 'Preload' },
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

  describe('isValidHttpEquiv', () => {
    it('should validate known http-equiv values', () => {
      VALID_HTTP_EQUIV_VALUES.forEach((value) => {
        assert.strictEqual(isValidHttpEquiv(value), true, `${value} should be valid`);
      });
    });

    it('should be case-insensitive', () => {
      assert.strictEqual(isValidHttpEquiv('Content-Security-Policy'), true);
      assert.strictEqual(isValidHttpEquiv('CONTENT-SECURITY-POLICY'), true);
    });

    it('should reject invalid values', () => {
      assert.strictEqual(isValidHttpEquiv('imagetoolbar'), false);
      assert.strictEqual(isValidHttpEquiv('x-frame-options'), false);
      assert.strictEqual(isValidHttpEquiv('description'), false);
    });

    it('should handle null/undefined', () => {
      assert.strictEqual(isValidHttpEquiv(null), false);
      assert.strictEqual(isValidHttpEquiv(undefined), false);
    });
  });

  describe('validateCSP', () => {
    it('should warn about CSP Report-Only', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'content-security-policy-report-only' },
          },
          {
            key: { value: 'content' },
            value: { type: 'AttributeValue', value: "default-src 'self'" },
          },
        ],
      };
      const warnings = validateCSP(node);
      assert.strictEqual(warnings.length, 1);
      assert.ok(warnings[0].includes('Report-Only'));
    });

    it('should warn about CSP meta tags in general', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'content-security-policy' },
          },
          {
            key: { value: 'content' },
            value: { type: 'AttributeValue', value: "default-src 'self'" },
          },
        ],
      };
      const warnings = validateCSP(node);
      assert.ok(warnings.some((w) => w.includes('preload scanner')));
    });

    it('should detect missing content attribute', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'content-security-policy' },
          },
        ],
      };
      const warnings = validateCSP(node);
      assert.ok(warnings.some((w) => w.includes('content attribute must be set')));
    });

    it('should warn about unsupported directives', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'content-security-policy' },
          },
          {
            key: { value: 'content' },
            value: { type: 'AttributeValue', value: "default-src 'self'; report-uri /csp-report" },
          },
        ],
      };
      const warnings = validateCSP(node);
      assert.ok(warnings.some((w) => w.includes('report-uri')));
    });
  });

  describe('validateHttpEquiv', () => {
    it('should warn about deprecated IE features', () => {
      const deprecatedValues = ['imagetoolbar', 'x-ua-compatible', 'cleartype', 'msthemecompatible'];
      deprecatedValues.forEach((value) => {
        const node = {
          name: 'meta',
          attributes: [
            {
              key: { value: 'http-equiv' },
              value: { type: 'AttributeValue', value },
            },
          ],
        };
        const warnings = validateHttpEquiv(node);
        assert.ok(warnings.length > 0);
        assert.ok(warnings[0].includes('Internet Explorer') || warnings[0].includes('deprecated'));
      });
    });

    it('should warn about refresh meta tags', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'refresh' },
          },
          {
            key: { value: 'content' },
            value: { type: 'AttributeValue', value: '5' },
          },
        ],
      };
      const warnings = validateHttpEquiv(node);
      assert.ok(warnings.length > 0);
      assert.ok(warnings[0].includes('refresh'));
    });

    it('should warn about cache-control meta tags', () => {
      const cacheValues = ['cache-control', 'pragma', 'expires'];
      cacheValues.forEach((value) => {
        const node = {
          name: 'meta',
          attributes: [
            {
              key: { value: 'http-equiv' },
              value: { type: 'AttributeValue', value },
            },
          ],
        };
        const warnings = validateHttpEquiv(node);
        assert.ok(warnings.some((w) => w.includes('HTTP headers')));
      });
    });

    it('should warn about misused name attributes', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'description' },
          },
        ],
      };
      const warnings = validateHttpEquiv(node);
      assert.ok(warnings.some((w) => w.includes('meta[name=')));
    });
  });

  describe('validateMetaViewport', () => {
    it('should warn about user-scalable=no', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
          {
            key: { value: 'content' },
            value: { type: 'AttributeValue', value: 'user-scalable=no' },
          },
        ],
      };
      const warnings = validateMetaViewport(node);
      assert.ok(warnings.some((w) => w.includes('accessibility')));
    });

    it('should warn about maximum-scale less than 2', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
          {
            key: { value: 'content' },
            value: { type: 'AttributeValue', value: 'maximum-scale=1.5' },
          },
        ],
      };
      const warnings = validateMetaViewport(node);
      assert.ok(warnings.some((w) => w.includes('accessibility')));
    });

    it('should validate width values', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
          {
            key: { value: 'content' },
            value: { type: 'AttributeValue', value: 'width=99999' },
          },
        ],
      };
      const warnings = validateMetaViewport(node);
      assert.ok(warnings.some((w) => w.includes('Invalid width')));
    });

    it('should detect invalid directives', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
          {
            key: { value: 'content' },
            value: { type: 'AttributeValue', value: 'invalid-directive=yes' },
          },
        ],
      };
      const warnings = validateMetaViewport(node);
      assert.ok(warnings.some((w) => w.includes('Invalid viewport directive')));
    });

    it('should warn about shrink-to-fit', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'name' },
            value: { type: 'AttributeValue', value: 'viewport' },
          },
          {
            key: { value: 'content' },
            value: { type: 'AttributeValue', value: 'shrink-to-fit=no' },
          },
        ],
      };
      const warnings = validateMetaViewport(node);
      assert.ok(warnings.some((w) => w.includes('obsolete')));
    });
  });

  describe('validateContentType', () => {
    it('should warn about non-UTF-8 charsets', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'charset' },
            value: { type: 'AttributeValue', value: 'iso-8859-1' },
          },
        ],
      };
      const warnings = validateContentType(node);
      assert.ok(warnings.some((w) => w.includes('UTF-8')));
    });

    it('should accept UTF-8', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'charset' },
            value: { type: 'AttributeValue', value: 'utf-8' },
          },
        ],
      };
      const warnings = validateContentType(node);
      assert.strictEqual(warnings.length, 0);
    });

    it('should be case-insensitive for UTF-8', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'charset' },
            value: { type: 'AttributeValue', value: 'UTF-8' },
          },
        ],
      };
      const warnings = validateContentType(node);
      assert.strictEqual(warnings.length, 0);
    });
  });

  describe('validateDefaultStyle', () => {
    it('should warn about missing content attribute', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'default-style' },
          },
        ],
      };
      const warnings = validateDefaultStyle(node);
      assert.ok(warnings.some((w) => w.includes('content attribute')));
    });

    it('should warn about FOUC', () => {
      const node = {
        name: 'meta',
        attributes: [
          {
            key: { value: 'http-equiv' },
            value: { type: 'AttributeValue', value: 'default-style' },
          },
          {
            key: { value: 'content' },
            value: { type: 'AttributeValue', value: 'preferred' },
          },
        ],
      };
      const warnings = validateDefaultStyle(node);
      assert.ok(warnings.some((w) => w.includes('flash of unstyled content')));
    });
  });
});
