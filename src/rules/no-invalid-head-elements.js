/**
 * Rule: no-invalid-head-elements
 * Ensures only valid elements are used in the <head>
 */

import { isValidHeadElement } from '../utils/validation-helpers.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid elements in the HTML head',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      invalidElement: '{{tagName}} elements are not allowed in the <head>',
      removeElement: 'Remove this {{tagName}} element from <head>',
    },
    schema: [],
    hasSuggestions: true,
  },
  
  create(context) {
    return {
      'Tag[parent.name="head"]'(node) {
        if (!isValidHeadElement(node.name)) {
          context.report({
            node,
            messageId: 'invalidElement',
            data: {
              tagName: node.name,
            },
            suggest: [{
              messageId: 'removeElement',
              data: {
                tagName: node.name,
              },
              fix(fixer) {
                // Remove the entire element including surrounding whitespace
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
            }],
          });
        }
      },
    };
  },
};
