/**
 * Rule: require-meta-viewport
 * Ensures a meta viewport element exists in the <head>
 */

import { isMetaViewport } from '../utils/validation-helpers.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a meta viewport element in the head',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      missingViewport: 'The <head> element should contain a <meta name="viewport"> element for responsive design',
    },
    schema: [],
  },

  create(context) {
    let viewportCount = 0;
    let headNode = null;

    return {
      'Tag[name="head"]'(node) {
        // Reset counter for each head element
        viewportCount = 0;
        headNode = node;
      },

      'Tag[parent.name="head"][name="meta"]'(node) {
        if (isMetaViewport(node)) {
          viewportCount++;
        }
      },

      'Tag[name="head"]:exit'(node) {
        if (viewportCount === 0) {
          context.report({
            node: headNode?.openStart || headNode || node,
            messageId: 'missingViewport',
          });
        }

        // Reset for next head
        viewportCount = 0;
        headNode = null;
      },
    };
  },
};
