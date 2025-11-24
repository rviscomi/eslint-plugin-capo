import { getFindingsForRule, removeNodeWithWhitespace } from '../utils/capo-analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow preload links for resources already discoverable by other elements',
      category: 'Performance',
      recommended: true,
    },
    messages: {
      unnecessaryPreload:
        'This preload has little to no effect. {{href}} is already discoverable by another {{tagName}} element.',
      removePreload: 'Remove unnecessary preload',
    },
    hasSuggestions: true,
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'no-unnecessary-preload');

        findings.forEach((finding) => {
          // Extract href and tagName from the message
          const match = finding.message.match(
            /This preload has little to no effect\. (.+?) is already discoverable by another (\w+) element\./
          );
          const href = match ? match[1] : '';
          const tagName = match ? match[2] : '';

          context.report({
            node: finding.node,
            loc: finding.location,
            messageId: 'unnecessaryPreload',
            data: {
              href,
              tagName,
            },
            suggest: [
              {
                messageId: 'removePreload',
                fix: function (fixer) {
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
