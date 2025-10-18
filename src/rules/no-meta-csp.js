/**
 * Rule: no-meta-csp
 * Disallows CSP meta tags (recommends using HTTP headers instead)
 */

import { isMetaCSP, validateCSP, getAttributeValue } from '../utils/validation-helpers.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow CSP meta tags that disable the preload scanner',
      category: 'Performance',
      recommended: true,
    },
    hasSuggestions: true,
    messages: {
      metaCSP: '{{message}}',
      removeTag: 'Remove this CSP meta tag (use HTTP headers instead)',
    },
    schema: [],
  },

  create(context) {
    return {
      'Tag[parent.name="head"][name="meta"]'(node) {
        if (isMetaCSP(node)) {
          const warnings = validateCSP(node, context);

          warnings.forEach((warning) => {
            context.report({
              node,
              messageId: 'metaCSP',
              data: {
                message: warning,
              },
              suggest: [
                {
                  messageId: 'removeTag',
                  fix(fixer) {
                    return fixer.remove(node);
                  },
                },
              ],
            });
          });
        }
      },
    };
  },
};
