/**
 * Rule: require-order
 * Validates that head elements are in optimal order based on capo.js rules
 * https://github.com/rviscomi/capo.js
 */

import { getFindingsForRule } from '../utils/capo-analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce optimal ordering of head elements for performance',
      category: 'Performance',
      recommended: true,
    },
    messages: {
      incorrectOrder: '{{message}}',
      wrongOrder: '{{next}} element should come before {{current}} element',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'require-order');

        if (findings.length === 0) {
          return;
        }

        findings.forEach((finding) => {
          context.report({
            node: finding.node,
            messageId: 'wrongOrder',
            data: {
              current: finding.current,
              currentWeight: finding.currentWeight,
              next: finding.next,
              nextWeight: finding.nextWeight,
            },
          });
        });
      },
    };
  },
};
