/**
 * Rule: no-invalid-http-equiv
 * Validates http-equiv meta tags
 */

import { isHttpEquiv, validateHttpEquiv, isMetaCSP, isOriginTrial, isDefaultStyle, isContentType, getAttributeValue, isValidHttpEquiv } from '../utils/validation-helpers.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid or deprecated http-equiv meta tags',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      invalidHttpEquiv: '{{message}}',
      removeTag: 'Remove this deprecated meta tag',
    },
    schema: [],
    hasSuggestions: true,
  },
  
  create(context) {
    return {
      'Tag[parent.name="head"][name="meta"]'(node) {
        if (!isHttpEquiv(node)) return;
        
        // Skip if it's handled by more specific rules
        if (isMetaCSP(node) || isOriginTrial(node) || isDefaultStyle(node) || isContentType(node)) {
          return;
        }
        
        const warnings = validateHttpEquiv(node);
        
        warnings.forEach(warning => {
          const httpEquiv = getAttributeValue(node, 'http-equiv');
          
          // If it's not a valid value, suggest removal
          const shouldSuggestRemoval = httpEquiv && !isValidHttpEquiv(httpEquiv);
          
          const report = {
            node,
            messageId: 'invalidHttpEquiv',
            data: {
              message: warning,
            },
          };
          
          // Suggest removing invalid/deprecated tags
          if (shouldSuggestRemoval) {
            report.suggest = [{
              messageId: 'removeTag',
              fix(fixer) {
                // Remove the entire meta tag including surrounding whitespace/newline
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
            }];
          }
          
          context.report(report);
        });
      },
    };
  },
};
