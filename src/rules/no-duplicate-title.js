/**
 * Rule: no-duplicate-title
 * Ensures there is only one <title> element in the <head>
 */

import { getFindingsForRule, removeNodeWithWhitespace } from '../utils/capo-analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow duplicate title elements in the head',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      duplicateTitle: '{{message}}',
      removeDuplicateTitle: 'Remove duplicate title',
    },
    hasSuggestions: true,
    fixable: 'code',
    schema: [],
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'no-duplicate-title');

        // Only report on duplicate titles (skip the first one)
        // capo.js returns all title elements when count != 1
        if (findings.length > 1) {
          // Skip the first title, report on the rest as duplicates
          findings.slice(1).forEach((finding) => {
            context.report({
              node: finding.node,
              messageId: 'duplicateTitle',
              data: {
                message: finding.message,
              },
              suggest: [
                {
                  messageId: 'removeDuplicateTitle',
                  fix(fixer) {
                    return removeNodeWithWhitespace(fixer, context, finding.node);
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
