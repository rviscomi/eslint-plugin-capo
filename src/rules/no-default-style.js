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
    hasSuggestions: true,
    messages: {
      noDefaultStyle: '{{message}}',
      removeTag: 'Remove this default-style meta tag',
    },
    schema: [],
  },

  create(context) {
    return {
      'Tag[parent.name="head"][name="meta"]'(node) {
        if (isDefaultStyle(node)) {
          const warnings = validateDefaultStyle(node);

          warnings.forEach((warning) => {
            context.report({
              node,
              messageId: 'noDefaultStyle',
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
