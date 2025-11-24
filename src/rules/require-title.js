/**
 * Rule: require-title
 * Ensures at least one <title> element exists in the <head>
 */

import { getFindingsForRule } from '../utils/capo-analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require title tag in head.',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/rviscomi/eslint-plugin-capo#require-title',
    },
    messages: {
      requireTitle: '{{message}}',
      missingTitle: 'Expected at least 1 <title> element, found 0',
    },
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'require-title');

        findings.forEach((finding) => {
          context.report({
            node,
            messageId: 'missingTitle',
          });
        });
      },
    };
  },
};
