/**
 * Rule: no-default-style
 * Discourages use of default-style meta tag
 */

import { getFindingsForRule } from '../analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow default-style meta tag (causes FOUC)',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noDefaultStyle: '{{message}}',
      removeTag: 'Remove the default-style meta tag',
    },
    fixable: 'code',
    schema: [],
    hasSuggestions: true,
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'no-default-style');

        findings.forEach((finding) => {
          context.report({
            node: finding.node,
            messageId: 'noDefaultStyle',
            data: {
              message: finding.message,
            },
            suggest: [
              {
                messageId: 'removeTag',
                fix(fixer) {
                  return fixer.remove(finding.node);
                },
              },
            ],
          });
        });
      },
    };
  },
};
