/**
 * Rule: no-invalid-head-elements
 * Ensures only valid elements are used in the <head>
 */

import { getFindingsForRule, removeNodeWithWhitespace } from '../utils/capo-analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid elements in the HTML head',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      invalidElement: '{{tagName}} elements are not allowed in the <head>',
      removeElement: 'Remove invalid element',
    },
    hasSuggestions: true,
    fixable: 'code',
    schema: [],
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'no-invalid-head-elements');

        findings.forEach((finding) => {
          // Extract tag name from the message (format: "<tagName> elements are not allowed...")
          const tagName = finding.message.split(' ')[0];

          context.report({
            node: finding.node,
            messageId: 'invalidElement',
            data: {
              tagName,
            },
            suggest: [
              {
                messageId: 'removeElement',
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
