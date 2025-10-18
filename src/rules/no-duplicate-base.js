/**
 * Rule: no-duplicate-base
 * Ensures at most one <base> element exists in the <head>
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow multiple base elements in the head',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      duplicateBase: 'Expected at most 1 <base> element, found {{count}}',
      removeDuplicate: 'Remove this duplicate <base> element',
    },
    schema: [],
    hasSuggestions: true,
  },

  create(context) {
    let baseCount = 0;

    return {
      'Tag[name="head"]'(node) {
        // Reset counter for each head element
        baseCount = 0;
      },

      'Tag[parent.name="head"][name="base"]'(node) {
        baseCount++;

        if (baseCount > 1) {
          context.report({
            node,
            messageId: 'duplicateBase',
            data: {
              count: baseCount,
            },
            suggest: [
              {
                messageId: 'removeDuplicate',
                fix(fixer) {
                  // Remove this duplicate base element
                  const sourceCode = context.sourceCode || context.getSourceCode();
                  const text = sourceCode.getText();
                  const nodeStart = node.range[0];
                  const nodeEnd = node.range[1];

                  // Find the start of the line (including indentation)
                  let lineStart = nodeStart;
                  while (lineStart > 0 && text[lineStart - 1] !== '\n') {
                    lineStart--;
                  }

                  // Find the end including the newline
                  let lineEnd = nodeEnd;
                  if (text[lineEnd] === '\n') {
                    lineEnd++;
                  }

                  return fixer.removeRange([lineStart, lineEnd]);
                },
              },
            ],
          });
        }
      },

      'Tag[name="head"]:exit'(node) {
        // Reset for next head
        baseCount = 0;
      },
    };
  },
};
