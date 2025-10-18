/**
 * Rule: no-unnecessary-preload
 * Disallow preload links for resources already discoverable by other elements
 * https://github.com/rviscomi/capo.js
 */

import { getAttributeValue, normalizeUrl } from '../utils/validation-helpers.js';

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow preload links for resources already discoverable by other elements',
      category: 'Performance',
      recommended: true,
    },
    hasSuggestions: true,
    messages: {
      unnecessaryPreload:
        'This preload has little to no effect. "{{href}}" is already discoverable by a <{{tagName}}> element.',
      removePreload: 'Remove this unnecessary preload',
    },
    schema: [],
  },

  create(context) {
    return {
      'Tag[name="head"]'(headNode) {
        // Get all children of head
        const children = headNode.children || [];

        // Find all preload/modulepreload links
        const preloadLinks = children.filter((child) => {
          if (child.name !== 'link') return false;
          const rel = getAttributeValue(child, 'rel');
          const relLower = rel?.toLowerCase();
          return relLower === 'preload' || relLower === 'modulepreload';
        });

        // Find all resource-loading elements (scripts, stylesheets, etc.)
        const resourceElements = children.filter((child) => {
          // Script tags
          if (child.type === 'ScriptTag' || child.name === 'script') {
            return true;
          }
          // Link stylesheets (but not preload/modulepreload)
          if (child.name === 'link') {
            const rel = getAttributeValue(child, 'rel');
            const relLower = rel?.toLowerCase();
            return relLower === 'stylesheet';
          }
          return false;
        });

        // Check each preload against resource elements
        for (const preloadLink of preloadLinks) {
          const preloadHref = getAttributeValue(preloadLink, 'href');
          if (!preloadHref) continue;

          const normalizedPreloadUrl = normalizeUrl(preloadHref);
          if (!normalizedPreloadUrl) continue;

          // Check if this URL is already loaded by another element
          const matchingElement = resourceElements.find((element) => {
            let resourceUrl = null;

            if (element.type === 'ScriptTag' || element.name === 'script') {
              resourceUrl = getAttributeValue(element, 'src');
            } else if (element.name === 'link') {
              resourceUrl = getAttributeValue(element, 'href');
            }

            if (!resourceUrl) return false;

            const normalizedResourceUrl = normalizeUrl(resourceUrl);
            return normalizedResourceUrl === normalizedPreloadUrl;
          });

          if (matchingElement) {
            const tagName = matchingElement.name || matchingElement.type.replace('Tag', '').toLowerCase();

            context.report({
              node: preloadLink,
              messageId: 'unnecessaryPreload',
              data: {
                href: preloadHref,
                tagName: tagName,
              },
              suggest: [
                {
                  messageId: 'removePreload',
                  fix(fixer) {
                    return fixer.remove(preloadLink);
                  },
                },
              ],
            });
          }
        }
      },
    };
  },
};
