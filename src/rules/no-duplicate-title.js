/**
 * Rule: no-duplicate-title
 * Ensures there is only one <title> element in the <head>
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow duplicate title elements in the head',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      duplicateTitle: 'Only one <title> element is allowed in the <head>',
      removeDuplicateTitle: 'Remove this duplicate <title> element',
    },
    schema: [],
    hasSuggestions: true,
  },

  create(context) {
    let firstTitleSeen = false;

    return {
      'Tag[name="head"]'() {
        // Reset for each head element
        firstTitleSeen = false;
      },

      'Tag[parent.name="head"][name="title"]'(node) {
        if (firstTitleSeen) {
          context.report({
            node,
            messageId: 'duplicateTitle',
            suggest: [
              {
                messageId: 'removeDuplicateTitle',
                fix(fixer) {
                  // Remove this duplicate title element
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

        firstTitleSeen = true;
      },

      'Tag[name="head"]:exit'() {
        // Reset for next head
        firstTitleSeen = false;
      },
    };
  },
};
