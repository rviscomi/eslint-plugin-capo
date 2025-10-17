/**
 * Element ordering utilities based on capo.js rules
 * https://github.com/rviscomi/capo.js/blob/main/src/lib/rules.js
 * 
 * Defines the optimal order for elements in the HTML <head>
 */

import { getAttributeValue } from './validation-helpers.js';

/**
 * Element weight hierarchy (higher = should come earlier)
 */
export const ElementWeights = {
  META: 10,
  TITLE: 9,
  PRECONNECT: 8,
  ASYNC_SCRIPT: 7,
  IMPORT_STYLES: 6,
  SYNC_SCRIPT: 5,
  SYNC_STYLES: 4,
  PRELOAD: 3,
  DEFER_SCRIPT: 2,
  PREFETCH_PRERENDER: 1,
  OTHER: 0
};

/**
 * Meta http-equiv keywords that have high priority
 */
export const META_HTTP_EQUIV_KEYWORDS = [
  'accept-ch',
  'content-security-policy',
  'content-type',
  'default-style',
  'delegate-ch',
  'origin-trial',
  'x-dns-prefetch-control'
];

/**
 * Check if element is a high-priority meta tag
 */
export function isMeta(node) {
  if (node.name === 'base') return true;
  if (node.name !== 'meta') return false;
  
  // Check for charset
  const hasCharset = node.attributes?.some(attr => {
    // Support both @html-eslint/parser (key.value) and vue-eslint-parser (key.name)
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'charset';
  });
  if (hasCharset) return true;
  
  // Check for viewport
  const name = getAttributeValue(node, 'name');
  if (name?.toLowerCase() === 'viewport') return true;
  
  // Check for important http-equiv values
  const httpEquiv = getAttributeValue(node, 'http-equiv');
  if (httpEquiv) {
    const httpEquivLower = httpEquiv.toLowerCase();
    return META_HTTP_EQUIV_KEYWORDS.some(keyword => 
      httpEquivLower === keyword.toLowerCase()
    );
  }
  
  return false;
}

/**
 * Check if element is a title tag
 */
export function isTitle(node) {
  return node.name === 'title';
}

/**
 * Check if element is a preconnect link
 */
export function isPreconnect(node) {
  if (node.name !== 'link') return false;
  const rel = getAttributeValue(node, 'rel');
  return rel?.toLowerCase() === 'preconnect';
}

/**
 * Check if element is an async script
 */
export function isAsyncScript(node) {
  if (node.name !== 'script') return false;
  
  const hasSrc = node.attributes?.some(attr => {
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'src';
  });
  const hasAsync = node.attributes?.some(attr => {
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'async';
  });
  
  return hasSrc && hasAsync;
}

/**
 * Check if element is a style with @import
 */
export function isImportStyles(node) {
  if (node.name !== 'style') return false;
  
  // Check text content for @import
  const content = getTextContent(node);
  return /@import/.test(content);
}

/**
 * Check if element is a synchronous script
 */
export function isSyncScript(node) {
  if (node.name !== 'script') return false;
  
  const hasSrc = node.attributes?.some(attr => {
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'src';
  });
  const hasDefer = node.attributes?.some(attr => {
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'defer';
  });
  const hasAsync = node.attributes?.some(attr => {
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'async';
  });
  const type = getAttributeValue(node, 'type');
  const isModule = type?.toLowerCase().includes('module');
  const isJson = type?.toLowerCase().includes('json');
  
  // Sync script: has src, but no defer/async/module, and not JSON
  if (!hasSrc) return true; // Inline scripts are sync
  return !hasDefer && !isModule && !hasAsync && !isJson;
}

/**
 * Check if element is synchronous styles
 */
export function isSyncStyles(node) {
  if (node.name === 'style') return true;
  if (node.name !== 'link') return false;
  
  const rel = getAttributeValue(node, 'rel');
  return rel?.toLowerCase() === 'stylesheet';
}

/**
 * Check if element is a preload link
 */
export function isPreload(node) {
  if (node.name !== 'link') return false;
  const rel = getAttributeValue(node, 'rel');
  const relLower = rel?.toLowerCase();
  return relLower === 'preload' || relLower === 'modulepreload';
}

/**
 * Check if element is a deferred script
 */
export function isDeferScript(node) {
  if (node.name !== 'script') return false;
  
  const hasSrc = node.attributes?.some(attr => {
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'src';
  });
  const hasDefer = node.attributes?.some(attr => {
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'defer';
  });
  const hasAsync = node.attributes?.some(attr => {
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'async';
  });
  const type = getAttributeValue(node, 'type');
  const isModule = type?.toLowerCase() === 'module';
  
  if (!hasSrc) return false;
  
  // Defer script: has src with defer, or is a module without async
  return hasDefer || (isModule && !hasAsync);
}

/**
 * Check if element is a prefetch/prerender link
 */
export function isPrefetchPrerender(node) {
  if (node.name !== 'link') return false;
  const rel = getAttributeValue(node, 'rel');
  const relLower = rel?.toLowerCase();
  return relLower === 'prefetch' || 
         relLower === 'dns-prefetch' || 
         relLower === 'prerender';
}

/**
 * Get the weight of an element based on its type
 */
export function getWeight(node) {
  if (isMeta(node)) return ElementWeights.META;
  if (isTitle(node)) return ElementWeights.TITLE;
  if (isPreconnect(node)) return ElementWeights.PRECONNECT;
  if (isAsyncScript(node)) return ElementWeights.ASYNC_SCRIPT;
  if (isImportStyles(node)) return ElementWeights.IMPORT_STYLES;
  if (isSyncScript(node)) return ElementWeights.SYNC_SCRIPT;
  if (isSyncStyles(node)) return ElementWeights.SYNC_STYLES;
  if (isPreload(node)) return ElementWeights.PRELOAD;
  if (isDeferScript(node)) return ElementWeights.DEFER_SCRIPT;
  if (isPrefetchPrerender(node)) return ElementWeights.PREFETCH_PRERENDER;
  
  return ElementWeights.OTHER;
}

/**
 * Get element type name for display
 */
export function getElementTypeName(node) {
  if (isMeta(node)) return 'META';
  if (isTitle(node)) return 'TITLE';
  if (isPreconnect(node)) return 'PRECONNECT';
  if (isAsyncScript(node)) return 'ASYNC_SCRIPT';
  if (isImportStyles(node)) return 'IMPORT_STYLES';
  if (isSyncScript(node)) return 'SYNC_SCRIPT';
  if (isSyncStyles(node)) return 'SYNC_STYLES';
  if (isPreload(node)) return 'PRELOAD';
  if (isDeferScript(node)) return 'DEFER_SCRIPT';
  if (isPrefetchPrerender(node)) return 'PREFETCH_PRERENDER';
  return 'OTHER';
}

/**
 * Get text content from a node (helper for inline styles/scripts)
 */
function getTextContent(node) {
  // For inline elements, try to get text content
  if (node.children) {
    return node.children
      .filter(child => child.type === 'VText')
      .map(child => child.value)
      .join('');
  }
  return '';
}

/**
 * Check if element A should come before element B
 */
export function shouldComeBefore(nodeA, nodeB) {
  const weightA = getWeight(nodeA);
  const weightB = getWeight(nodeB);
  return weightA > weightB;
}

/**
 * Get optimal order description
 */
export function getOptimalOrderDescription() {
  return [
    '1. META (charset, viewport, CSP, etc.) - weight 10',
    '2. TITLE - weight 9',
    '3. PRECONNECT - weight 8',
    '4. ASYNC_SCRIPT - weight 7',
    '5. IMPORT_STYLES (@import in <style>) - weight 6',
    '6. SYNC_SCRIPT - weight 5',
    '7. SYNC_STYLES (<link rel="stylesheet">) - weight 4',
    '8. PRELOAD - weight 3',
    '9. DEFER_SCRIPT - weight 2',
    '10. PREFETCH/PRERENDER - weight 1',
    '11. OTHER - weight 0'
  ];
}
