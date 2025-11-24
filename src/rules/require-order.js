/**
 * Rule: require-order
 * Validates that head elements are in optimal order based on capo.js rules
 * https://github.com/rviscomi/capo.js
 */

import { getFindingsForRule, analyzeHead } from '../utils/capo-analyzer.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce optimal ordering of head elements for performance',
      category: 'Performance',
      recommended: true,
    },
    messages: {
      incorrectOrder: '{{message}}',
      wrongOrder: '{{next}} element should come before {{current}} element',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    return {
      'Tag[name="head"]'(node) {
        const findings = getFindingsForRule(context, node, 'require-order');

        if (findings.length === 0) {
          return;
        }

        findings.forEach((finding, index) => {
          const isFirst = index === 0;
          context.report({
            node: finding.node,
            messageId: 'wrongOrder',
            data: {
              current: finding.current,
              currentWeight: finding.currentWeight,
              next: finding.next,
              nextWeight: finding.nextWeight,
            },
            fix: isFirst
              ? (fixer) => {
                  const analysis = analyzeHead(context, node);
                  const sortedElements = (analysis.weights || [])
                    .sort((a, b) => b.weight - a.weight)
                    .map((w) => w.element);
                  const sourceCode = context.getSourceCode();

                  // Get the text of all sorted elements, joined by their original separators if possible,
                  // or just newlines. For simplicity and correctness, we'll join with newlines and let prettier handle formatting if used,
                  // but we should try to preserve original formatting if possible.
                  let indentation = '  '; // Default
                  if (node.children && node.children.length > 0) {
                    const firstChild = node.children[0];
                    if (firstChild.type === 'Text') {
                      const matches = firstChild.value.match(/\n([ \t]+)$/);
                      if (matches) {
                        indentation = matches[1];
                      }
                    }
                  }

                  let headIndentation = '';
                  const headStart = node.range[0];
                  const textBeforeHead = sourceCode.text.slice(0, headStart);
                  const lastNewlineBeforeHead = textBeforeHead.lastIndexOf('\n');
                  if (lastNewlineBeforeHead !== -1) {
                    const potentialIndent = textBeforeHead.slice(lastNewlineBeforeHead + 1);
                    if (potentialIndent.trim() === '') {
                      headIndentation = potentialIndent;
                    }
                  }

                  const allComments = sourceCode.getAllComments();
                  const originalElements = (analysis.weights || [])
                    .map((w) => w.element)
                    .sort((a, b) => a.range[0] - b.range[0]);

                  const sortedText =
                    '\n' +
                    indentation +
                    sortedElements
                      .map((el) => {
                        const originalIndex = originalElements.indexOf(el);
                        const previousElement = originalIndex > 0 ? originalElements[originalIndex - 1] : null;
                        const previousEnd = previousElement ? previousElement.range[1] : node.openEnd.range[1];

                        const associatedComments = allComments.filter((c) => {
                          return c.range[0] >= previousEnd && c.range[1] <= el.range[0];
                        });

                        const commentText = associatedComments.map((c) => `<!--${c.value}-->`).join('\n' + indentation);
                        const elText = sourceCode.getText(el);
                        return associatedComments.length > 0 ? commentText + '\n' + indentation + elText : elText;
                      })
                      .join('\n' + indentation) +
                    '\n' +
                    headIndentation;

                  return fixer.replaceTextRange([node.openEnd.range[1], node.close.range[0]], sortedText);
                }
              : null, // Only apply fix once for the first violation to avoid conflicts
          });
        });
      },
    };
  },
};
