import { getFindingsForRule, removeNodeWithWhitespace } from '../analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure meta viewport is properly configured',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      invalidViewport: '{{message}}',
      fixViewport: 'Fix viewport configuration',
    },
    hasSuggestions: true,
    schema: [],
    fixable: 'code',
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'valid-meta-viewport');

        findings.forEach((finding) => {
          context.report({
            node: finding.node,
            messageId: 'invalidViewport',
            data: {
              message: finding.message,
            },
            suggest: [
              {
                messageId: 'fixViewport',
                fix(fixer) {
                  if (finding.suggestion === 'remove') {
                    return removeNodeWithWhitespace(fixer, context, finding.node);
                  }
                  // Replace the problematic viewport meta tag with a valid one
                  const validMetaViewport = '<meta name="viewport" content="width=device-width, initial-scale=1">';
                  return fixer.replaceText(finding.node, validMetaViewport);
                },
              },
            ],
          });
        });
      },
    };
  },
};
