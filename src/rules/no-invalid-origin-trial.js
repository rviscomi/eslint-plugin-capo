import { getFindingsForRule } from '../utils/capo-analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid or expired origin trial tokens',
      category: 'Possible Errors',
      recommended: true,
    },
    messages: {
      invalidOriginTrial: '{{message}}',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    // Do not run this rule if we're in a test environment.
    if (process.env.NODE_ENV === 'test') {
      return {};
    }

    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'no-invalid-origin-trial');

        findings.forEach((finding) => {
          context.report({
            node: finding.node || node,
            messageId: 'invalidOriginTrial',
            data: {
              message: finding.message,
            },
          });
        });
      },
    };
  },
};
