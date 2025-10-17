/**
 * Rule: require-title
 * Ensures exactly one <title> element exists in the <head>
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require exactly one title element in the head',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingTitle: 'Expected exactly 1 <title> element, found {{count}}',
      duplicateTitle: '<title> should be the first of its type',
      removeDuplicateTitle: 'Remove this duplicate <title> element',
    },
    schema: [],
    hasSuggestions: true,
  },
  
  create(context) {
    let titleCount = 0;
    let firstTitleSeen = false;
    let firstTitleNode = null;
    let headNode = null;
    
    return {
      'Tag[name="head"]'(node) {
        // Reset counter for each head element
        titleCount = 0;
        firstTitleNode = null;
        headNode = node;
      },
      
      'Tag[parent.name="head"][name="title"]'(node) {
        titleCount++;
        
        if (!firstTitleNode) {
          firstTitleNode = node;
        }
        
        if (firstTitleSeen) {
          context.report({
            node,
            messageId: 'duplicateTitle',
            suggest: [{
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
            }],
          });
        }
        
        firstTitleSeen = true;
      },
      
      'Tag[name="head"]:exit'(node) {
        if (titleCount !== 1) {
          // Report on the first title if there are multiple, or on the head opening tag if there are none
          const reportNode = firstTitleNode || (headNode?.openStart || headNode);
          context.report({
            node: reportNode,
            messageId: 'missingTitle',
            data: {
              count: titleCount,
            },
          });
        }
        
        // Reset for next head
        titleCount = 0;
        firstTitleSeen = false;
        firstTitleNode = null;
        headNode = null;
      },
    };
  },
};
