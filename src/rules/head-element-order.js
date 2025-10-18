/**
 * Rule: head-element-order
 * Validates that head elements are in optimal order based on capo.js rules
 * https://github.com/rviscomi/capo.js
 */

import { getWeight, getElementTypeName, getOptimalOrderDescription } from '../utils/element-ordering.js';

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce optimal ordering of head elements for performance',
      category: 'Performance',
      recommended: false, // Can be noisy, so not in recommended by default
    },
    messages: {
      wrongOrder:
        'Element order suboptimal: {{current}} (weight {{currentWeight}}) should come after {{next}} (weight {{nextWeight}}).',
      orderInfo: 'Consider reordering head elements for optimal performance.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          severity: {
            type: 'string',
            enum: ['warning', 'error'],
            default: 'warning',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    return {
      'Tag[name="head"]'(headNode) {
        // Get all direct children of head
        // Note: @html-eslint/parser uses different types: Tag, ScriptTag, StyleTag
        const children =
          headNode.children?.filter(
            (child) => child.type === 'Tag' || child.type === 'ScriptTag' || child.type === 'StyleTag'
          ) || [];

        if (children.length === 0) return;

        // Check each adjacent pair for ordering issues
        for (let i = 0; i < children.length - 1; i++) {
          const current = children[i];
          const next = children[i + 1];

          const currentWeight = getWeight(current);
          const nextWeight = getWeight(next);

          // If current element has lower weight than next, it's out of order
          if (currentWeight < nextWeight) {
            const currentType = getElementTypeName(current);
            const nextType = getElementTypeName(next);

            context.report({
              node: current,
              messageId: 'wrongOrder',
              data: {
                current: currentType,
                currentWeight,
                next: nextType,
                nextWeight,
              },
            });
          }
        }
      },
    };
  },
};
