/**
 * Rule: no-meta-csp
 * Disallows CSP meta tags (recommends using HTTP headers instead)
 */

import { getFindingsForRule, removeNodeWithWhitespace } from '../utils/capo-analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow meta CSP.',
      category: 'Security',
      recommended: true,
      url: 'https://github.com/rviscomi/eslint-plugin-capo/blob/main/docs/rules/no-meta-csp.md',
    },
    messages: {
      metaCSP: '{{message}}',
      removeMetaCSP: 'Remove the meta CSP tag.',
    },
    hasSuggestions: true,
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'no-meta-csp');

        findings.forEach((finding) => {
          context.report({
            node: finding.node,
            messageId: 'metaCSP',
            data: {
              message: finding.message,
            },
            suggest: [
              {
                messageId: 'removeMetaCSP',
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
