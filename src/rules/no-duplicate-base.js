/**
 * Rule: no-duplicate-base
 * Ensures at most one <base> element exists in the <head>
 */

import { getFindingsForRule, removeNodeWithWhitespace } from '../utils/capo-analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow multiple base elements in the head',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/rviscomi/eslint-plugin-capo#no-duplicate-base',
    },
    messages: {
      duplicateBase: '{{message}}',
      removeDuplicateBase: 'Remove duplicate base',
    },
    hasSuggestions: true,
    schema: [],
    fixable: 'code',
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'no-duplicate-base');

        findings.forEach((finding) => {
          context.report({
            node: finding.node || node,
            messageId: 'duplicateBase',
            data: {
              message: finding.message,
            },

            suggest: [
              {
                messageId: 'removeDuplicateBase',
                fix(fixer) {
                  return removeNodeWithWhitespace(fixer, context, finding.node);
                },
              },
            ],
          });
        });
      },
    };
  },
};
