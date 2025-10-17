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
    messages: {
      metaCSP: '{{message}}',
    },
    schema: [],
  },
  
  create(context) {
    return {
      'Tag[parent.name="head"][name="meta"]'(node) {
        if (isMetaCSP(node)) {
          const warnings = validateCSP(node, context);
          
          warnings.forEach(warning => {
            context.report({
              node,
              messageId: 'metaCSP',
              data: {
                message: warning,
              },
            });
          });
        }
      },
    };
  },
};
