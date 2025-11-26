/**
 * Rule: valid-charset
 * Validates character encoding declaration
 */

import { getFindingsForRule, removeNodeWithWhitespace } from '../analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure proper UTF-8 character encoding is declared',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      invalidCharset: '{{message}}',
      duplicateCharset: '{{message}}',
      fixToUtf8: 'Fix character encoding to UTF-8',
      removeCharset: 'Remove duplicate charset declaration',
    },
    hasSuggestions: true,
    schema: [],
    fixable: 'code',
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'valid-charset');

        // Group findings by node to handle multiple warnings for the same element
        const findingsByNode = new Map();
        findings.forEach((finding, index) => {
          const isDuplicate =
            finding.message && finding.message.includes('There can only be one meta-based character encoding');

          if (!findingsByNode.has(finding.node)) {
            findingsByNode.set(finding.node, { finding, index, isDuplicate });
          } else {
            // If we already have this node, prefer duplicate message over invalid
            const existing = findingsByNode.get(finding.node);
            if (isDuplicate && !existing.isDuplicate) {
              findingsByNode.set(finding.node, { finding, index, isDuplicate });
            }
          }
        });

        // Report each unique node once
        findingsByNode.forEach(({ finding, index, isDuplicate }) => {
          // For duplicates, only report on 2nd+ occurrences (skip the first)
          if (isDuplicate && index === 0) {
            return;
          }

          context.report({
            node: finding.node,
            messageId: isDuplicate ? 'duplicateCharset' : 'invalidCharset',
            data: {
              message: finding.message,
            },
            suggest: isDuplicate
              ? [
                  {
                    messageId: 'removeCharset',
                    fix(fixer) {
                      return removeNodeWithWhitespace(fixer, context, finding.node);
                    },
                  },
                ]
              : [
                  {
                    messageId: 'fixToUtf8',
                    fix(fixer) {
                      // Try to fix the charset attribute to utf-8
                      const sourceCode = context.getSourceCode();
                      const text = sourceCode.getText(finding.node);
                      const fixed = text.replace(/charset\s*=\s*["']?[^"'\s>]+["']?/gi, 'charset="utf-8"');
                      return fixer.replaceText(finding.node, fixed);
                    },
                  },
                ],
          });
        });
      },
    };
  },
};
