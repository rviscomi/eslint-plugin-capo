import { getFindingsForRule, removeNodeWithWhitespace } from '../analyzer.js';

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
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'no-invalid-origin-trial');

        findings.forEach((finding) => {
          context.report({
            node: finding.node,
            messageId: 'invalidOriginTrial',
            data: {
              message: finding.message,
            },
            fix(fixer) {
              return removeNodeWithWhitespace(fixer, context, finding.node);
            },
          });
        });
      },
    };
  },
};
