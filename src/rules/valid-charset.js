/**
 * Rule: valid-charset
 * Validates character encoding declaration
 */

import { isContentType, validateContentType, getAttributeValue } from '../utils/validation-helpers.js';

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
      duplicateCharset: 'There can only be one meta-based character encoding declaration per document.',
      fixToUtf8: 'Change charset to "utf-8"',
    },
    schema: [],
    hasSuggestions: true,
  },

  create(context) {
    let charsetCount = 0;

    return {
      'Tag[name="head"]'(node) {
        // Reset counter for each head element
        charsetCount = 0;
      },

      'Tag[parent.name="head"][name="meta"]'(node) {
        if (isContentType(node)) {
          charsetCount++;

          if (charsetCount > 1) {
            context.report({
              node,
              messageId: 'duplicateCharset',
            });
            return;
          }

          const warnings = validateContentType(node);

          warnings.forEach((warning) => {
            const charset = getAttributeValue(node, 'charset');
            const isWrongCharset = charset && charset.toLowerCase() !== 'utf-8';

            const report = {
              node,
              messageId: 'invalidCharset',
              data: {
                message: warning,
              },
            };

            // Add suggestion to fix charset if it's the wrong value
            if (isWrongCharset) {
              const charsetAttr = node.attributes?.find((attr) => {
                const keyName = attr.key?.value;
                return keyName?.toLowerCase() === 'charset';
              });

              if (charsetAttr && charsetAttr.value) {
                report.suggest = [
                  {
                    messageId: 'fixToUtf8',
                    fix(fixer) {
                      // Replace just the value text (not including the quotes)
                      const valueNode = charsetAttr.value;
                      return fixer.replaceTextRange(valueNode.range, 'utf-8');
                    },
                  },
                ];
              }
            }

            context.report(report);
          });
        }
      },

      'Tag[name="head"]:exit'(node) {
        // Reset for next head
        charsetCount = 0;
      },
    };
  },
};
