/**
 * Rule: require-title
 * Ensures at least one <title> element exists in the <head>
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a title element in the head',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingTitle: 'The <head> element must contain a <title> element',
    },
    schema: [],
  },
  
  create(context) {
    let titleCount = 0;
    let headNode = null;
    
    return {
      'Tag[name="head"]'(node) {
        // Reset counter for each head element
        titleCount = 0;
        headNode = node;
      },
      
      'Tag[parent.name="head"][name="title"]'() {
        titleCount++;
      },
      
      'Tag[name="head"]:exit'(node) {
        if (titleCount === 0) {
          context.report({
            node: headNode?.openStart || headNode || node,
            messageId: 'missingTitle',
          });
        }
        
        // Reset for next head
        titleCount = 0;
        headNode = null;
      },
    };
  },
};
