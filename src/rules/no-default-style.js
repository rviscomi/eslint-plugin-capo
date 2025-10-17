/**
 * Rule: no-default-style
 * Discourages use of default-style meta tag
 */

import { isDefaultStyle, validateDefaultStyle } from '../utils/validation-helpers.js';

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow default-style meta tag (causes FOUC)',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noDefaultStyle: '{{message}}',
    },
    schema: [],
  },
  
  create(context) {
    return {
      'Tag[parent.name="head"][name="meta"]'(node) {
        if (isDefaultStyle(node)) {
          const warnings = validateDefaultStyle(node);
          
          warnings.forEach(warning => {
            context.report({
              node,
              messageId: 'noDefaultStyle',
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
