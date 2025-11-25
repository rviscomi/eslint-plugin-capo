/**
 * Capo.js analyzer wrapper for ESLint plugin
 * Provides cached analysis of head elements using capo.js v2.0
 */

import { analyzeHead as analyzeHeadCore, checkOrdering } from '@rviscomi/capo.js';
import { HtmlEslintAdapter } from './adapters/html-eslint-adapter.js';

// Create a singleton adapter instance - it's stateless
const adapter = new HtmlEslintAdapter();

/**
 * Map validation warnings and custom validations to specific rule IDs
 * This is needed because capo.js v2 returns all findings together,
 * but ESLint rules need to filter for their specific violations
 */
/**
 * Map capo.js v2 analysis results to findings for a specific ESLint rule
 * capo.js now returns {ruleId, warning/warnings, elements/element} with ruleId field
 * so we can directly match instead of parsing messages
 *
 * @param {Object} analysis - Result from analyzeHead()
 * @param {string} ruleId - The ESLint rule ID to filter for
 * @returns {Array<{node, message}>} Array of findings for this rule
 */
export function mapFindingsToRule(analysis, ruleId) {
  const findings = [];

  // Special handling for require-order rule
  if (ruleId === 'require-order') {
    const orderingViolations = checkOrdering(analysis.weights || []);
    return orderingViolations.map((violation) => ({
      node: violation.currentElement,
      message: violation.message,
      current: violation.currentCategory,
      currentWeight: String(violation.currentWeight),
      next: violation.nextCategory,
      nextWeight: String(violation.nextWeight),
    }));
  }

  // Map validationWarnings (document-level issues)
  if (analysis.validationWarnings) {
    for (const warning of analysis.validationWarnings) {
      if (warning.ruleId === ruleId) {
        // Flatten elements array or use single element
        const elements = warning.elements || (warning.element ? [warning.element] : []);

        // If we got more elements than we expected, suggest removing the extras
        let suggestion = null;
        if (warning.warning.startsWith('Expected exactly 1')) {
          suggestion = 'remove';
        }

        if (elements.length > 0) {
          // Report on each problematic element
          elements.forEach((element) => {
            findings.push({
              node: element,
              message: warning.warning,
              suggestion,
            });
          });
        } else {
          // For "missing element" warnings, report on the head element
          findings.push({
            node: analysis.headElement,
            message: warning.warning,
          });
        }
      }
    }
  }

  // Map custom validations (element-level issues)
  if (analysis.customValidations) {
    for (const validation of analysis.customValidations) {
      if (validation.ruleId === ruleId) {
        // Each warning in this validation applies to this element
        for (const warningMessage of validation.warnings) {
          findings.push({
            node: validation.element,
            message: warningMessage,
          });
        }
      }
    }
  }

  return findings;
}

const analysisCache = new WeakMap();

export function analyzeHead(context, headNode) {
  if (analysisCache.has(headNode)) {
    return analysisCache.get(headNode);
  }

  const analysis = analyzeHeadCore(headNode, adapter, context.settings.capo || {});
  analysisCache.set(headNode, analysis);
  return analysis;
}

export function getFindingsForRule(context, headNode, rule) {
  const analysis = analyzeHead(context, headNode);
  const findings = mapFindingsToRule(analysis, rule);
  return findings;
}

/**
 * Helper to remove a node including its surrounding whitespace
 * This removes the entire line to avoid leaving empty lines
 */
export function removeNodeWithWhitespace(fixer, context, node) {
  const sourceCode = context.getSourceCode();
  const nodeText = sourceCode.getText(node);
  const beforeNode = sourceCode.getTokenBefore(node, { includeComments: true });
  const afterNode = sourceCode.getTokenAfter(node, { includeComments: true });

  // Get the range to remove
  let startPos = node.range[0];
  let endPos = node.range[1];

  // Check if we should include preceding whitespace
  const textBefore = sourceCode.text.slice(0, startPos);
  const lastNewline = textBefore.lastIndexOf('\n');
  let hasContentBeforeOnLine = false;

  if (lastNewline !== -1) {
    const beforeText = textBefore.slice(lastNewline + 1);
    if (beforeText.trim() === '') {
      // Only whitespace before the node on this line, include it
      startPos = lastNewline + 1;
    } else {
      hasContentBeforeOnLine = true;
    }
  } else {
    // No newline found, check if there's content from start
    if (textBefore.trim() !== '') {
      hasContentBeforeOnLine = true;
    }
  }

  // Only include trailing newline if node is on its own line
  if (!hasContentBeforeOnLine) {
    const textAfter = sourceCode.text.slice(endPos);
    const nextNewline = textAfter.indexOf('\n');
    if (nextNewline !== -1) {
      // Include the newline
      endPos = endPos + nextNewline + 1;
    }
  }

  return fixer.removeRange([startPos, endPos]);
}
