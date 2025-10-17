/**
 * Rule: valid-meta-viewport
 * Validates meta viewport configuration
 */

import { isMetaViewport, validateMetaViewport, getAttributeValue } from '../utils/validation-helpers.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure meta viewport is properly configured',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      invalidViewport: '{{message}}',
      missingViewport: 'Expected exactly 1 <meta name=viewport> element, found {{count}}',
      removeUserScalable: 'Remove "user-scalable=no" to allow zooming',
      removeMaximumScale: 'Remove "maximum-scale" to allow zooming',
    },
    schema: [],
    hasSuggestions: true,
  },
  
  create(context) {
    let viewportCount = 0;
    let firstViewportSeen = false;
    
    return {
      'Tag[name="head"]'(node) {
        // Reset counter for each head element
        viewportCount = 0;
        firstViewportSeen = false;
      },
      
      'Tag[parent.name="head"][name="meta"]'(node) {
        if (isMetaViewport(node)) {
          viewportCount++;
          
          // Check for redundant viewport
          if (firstViewportSeen) {
            context.report({
              node,
              messageId: 'invalidViewport',
              data: {
                message: 'Another meta viewport element has already been declared. Having multiple viewport settings can lead to unexpected behavior.',
              },
            });
            return;
          }
          
          firstViewportSeen = true;
          
          // Validate the viewport configuration
          const warnings = validateMetaViewport(node);
          
          warnings.forEach(warning => {
            const content = getAttributeValue(node, 'content');
            const report = {
              node,
              messageId: 'invalidViewport',
              data: {
                message: warning,
              },
            };
            
            // Add suggestions for common accessibility issues
            if (content) {
              const suggestions = [];
              const contentLower = content.toLowerCase();
              
              // Suggest removing user-scalable=no
              if (contentLower.includes('user-scalable=no') || contentLower.includes('user-scalable=0')) {
                const contentAttr = node.attributes?.find(attr => {
                  const keyName = attr.key?.value || attr.key?.name;
                  return keyName?.toLowerCase() === 'content';
                });
                
                if (contentAttr && contentAttr.value) {
                  suggestions.push({
                    messageId: 'removeUserScalable',
                    fix(fixer) {
                      // Remove user-scalable=no and any surrounding commas/spaces
                      let newContent = content
                        .replace(/,?\s*user-scalable\s*=\s*(no|0)\s*,?/gi, '')
                        .replace(/,\s*,/g, ',') // Remove double commas
                        .replace(/^,\s*|,\s*$/g, '') // Remove leading/trailing commas
                        .trim();
                      return fixer.replaceTextRange(contentAttr.value.range, newContent);
                    },
                  });
                }
              }
              
              // Suggest removing maximum-scale
              if (contentLower.includes('maximum-scale')) {
                const contentAttr = node.attributes?.find(attr => {
                  const keyName = attr.key?.value || attr.key?.name;
                  return keyName?.toLowerCase() === 'content';
                });
                
                if (contentAttr && contentAttr.value) {
                  suggestions.push({
                    messageId: 'removeMaximumScale',
                    fix(fixer) {
                      // Remove maximum-scale and any surrounding commas/spaces
                      let newContent = content
                        .replace(/,?\s*maximum-scale\s*=\s*[\d.]+\s*,?/gi, '')
                        .replace(/,\s*,/g, ',')
                        .replace(/^,\s*|,\s*$/g, '')
                        .trim();
                      return fixer.replaceTextRange(contentAttr.value.range, newContent);
                    },
                  });
                }
              }
              
              if (suggestions.length > 0) {
                report.suggest = suggestions;
              }
            }
            
            context.report(report);
          });
        }
      },
      
      'Tag[name="head"]:exit'(node) {
        if (viewportCount !== 1) {
          context.report({
            node,
            messageId: 'missingViewport',
            data: {
              count: viewportCount,
            },
          });
        }
        
        // Reset for next head
        viewportCount = 0;
        firstViewportSeen = false;
      },
    };
  },
};
