/**
 * Rule: require-meta-viewport
 * Ensures a meta viewport element exists in the <head>
 */

import { getFindingsForRule } from '../utils/capo-analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a meta viewport element in the head',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      missingViewport: '{{message}}',
    },
    schema: [],
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'require-meta-viewport');

        findings.forEach((finding) => {
          context.report({
            node: finding.node || node,
            messageId: 'missingViewport',
            data: {
              message: finding.message,
            },
          });
        });
      },
    };
  },
};
