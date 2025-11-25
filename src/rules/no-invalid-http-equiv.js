import { getFindingsForRule, removeNodeWithWhitespace } from '../analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid or deprecated http-equiv meta tags',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      invalidHttpEquiv: '{{message}}',
      removeMetaTag: 'Remove invalid meta tag',
    },
    hasSuggestions: true,
    fixable: 'code',
    schema: [],
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'no-invalid-http-equiv');

        findings.forEach((finding) => {
          context.report({
            node: finding.node,
            messageId: 'invalidHttpEquiv',
            data: {
              message: finding.message,
            },
            suggest: [
              {
                messageId: 'removeMetaTag',
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
