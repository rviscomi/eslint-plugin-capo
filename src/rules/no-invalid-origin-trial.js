/**
 * Rule: no-invalid-origin-trial
 * Validates that origin trial tokens are properly formatted and not expired.
 *
 * Origin trials allow developers to test experimental web platform features.
 * This rule checks:
 * - Token exists and is not empty
 * - Token can be decoded successfully
 * - Token has not expired
 *
 * Note: This rule cannot validate the origin since it's not known at lint time.
 *
 * @see https://github.com/GoogleChrome/OriginTrials
 */

import { isOriginTrial, getAttributeValue } from '../utils/validation-helpers.js';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid or expired origin trial tokens',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      missingContent: 'Origin trial meta tag is missing the content attribute',
      emptyToken: 'Origin trial token cannot be empty',
      invalidToken: 'Origin trial token is invalid or malformed',
      expiredToken: 'Origin trial token expired on {{expiryDate}}',
      invalidOrigin: 'Origin trial token is for {{tokenOrigin}} but expected {{expectedOrigin}}',
      invalidSubdomain: 'Origin trial token requires isSubdomain flag for subdomain usage',
      decodeError: 'Failed to decode origin trial token: {{error}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          origin: {
            type: 'string',
            description: 'The expected production origin (e.g., "https://example.com")',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const expectedOrigin = options.origin;
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      'Tag[parent.name="head"][name="meta"]'(node) {
        if (!isOriginTrial(node)) {
          return;
        }

        // Find the content attribute
        const contentValue = getAttributeValue(node, 'content');

        // Check if content attribute exists at all (null means missing)
        if (contentValue === null) {
          context.report({
            node,
            messageId: 'missingContent',
            fix(fixer) {
              return fixer.remove(node);
            },
          });
          return;
        }

        // For non-string values (shouldn't happen with @html-eslint/parser), skip validation
        if (typeof contentValue !== 'string') {
          return;
        }

        // Validate the token (handles empty strings and origin validation)
        const validation = validateOriginTrialToken(contentValue, expectedOrigin);

        if (!validation.valid) {
          // For expired, empty, or invalid tokens, suggest removing the entire meta tag
          // We never modify the token itself
          const shouldFix = ['expiredToken', 'emptyToken', 'invalidToken', 'missingContent'].includes(
            validation.messageId
          );

          context.report({
            node,
            messageId: validation.messageId,
            data: validation.data,
            fix: shouldFix
              ? (fixer) => {
                  return fixer.remove(node);
                }
              : undefined,
          });
        }
      },
    };
  },
};

/**
 * Validate an origin trial token
 * @param {string} token - The base64-encoded token
 * @param {string|undefined} expectedOrigin - Optional expected origin to validate against
 * @returns {Object} Validation result with valid flag and error details
 */
function validateOriginTrialToken(token, expectedOrigin) {
  if (!token || token.trim() === '') {
    return {
      valid: false,
      messageId: 'emptyToken',
    };
  }

  try {
    const payload = decodeOriginTrialToken(token);

    // Check if token is expired
    if (payload.expiry < new Date()) {
      return {
        valid: false,
        messageId: 'expiredToken',
        data: {
          expiryDate: payload.expiry.toISOString().split('T')[0],
        },
      };
    }

    // Validate origin if provided
    if (expectedOrigin) {
      const originValidation = validateOrigin(payload, expectedOrigin);
      if (!originValidation.valid) {
        return originValidation;
      }
    }

    return { valid: true };
  } catch (error) {
    // Token is invalid or malformed
    return {
      valid: false,
      messageId: 'invalidToken',
      data: {
        error: error.message,
      },
    };
  }
}

/**
 * Decode an origin trial token
 * Adapted from https://glitch.com/~ot-decode
 *
 * @param {string} token - Base64-encoded token
 * @returns {Object} Decoded payload with expiry date
 * @throws {Error} If token cannot be decoded
 */
function decodeOriginTrialToken(token) {
  try {
    // Decode base64
    const binaryString = atob(token);
    const buffer = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      buffer[i] = binaryString.charCodeAt(i);
    }

    const view = new DataView(buffer.buffer);

    // Read the payload length at offset 65 (big-endian uint32)
    const length = view.getUint32(65, false);

    // Extract and parse the JSON payload
    const payloadBytes = buffer.slice(69, 69 + length);
    const decoder = new TextDecoder();
    const payloadJson = decoder.decode(payloadBytes);
    const payload = JSON.parse(payloadJson);

    // Convert expiry from Unix timestamp to Date
    payload.expiry = new Date(payload.expiry * 1000);

    return payload;
  } catch (error) {
    throw new Error(`Unable to decode token: ${error.message}`);
  }
}

/**
 * Validate the origin in the token payload
 *
 * For static HTML linting, we expect tokens to be for the site's own origin.
 * Third-party origin trial tokens are typically injected at runtime by the 3P script,
 * not present in static HTML.
 *
 * @param {Object} payload - Decoded token payload
 * @param {string} expectedOrigin - Expected origin URL (the site's origin)
 * @returns {Object} Validation result
 */
function validateOrigin(payload, expectedOrigin) {
  const tokenOrigin = payload.origin;

  // Token matches the site's origin exactly - this is correct
  if (isSameOrigin(tokenOrigin, expectedOrigin)) {
    return { valid: true };
  }

  // Token is for a parent domain (e.g., example.com) and we're on a subdomain (sub.example.com)
  // This is valid if the token has the isSubdomain flag
  const expectedIsSubdomain = isSubdomain(tokenOrigin, expectedOrigin);
  if (expectedIsSubdomain && payload.isSubdomain) {
    return { valid: true };
  }

  if (expectedIsSubdomain && !payload.isSubdomain) {
    return {
      valid: false,
      messageId: 'invalidSubdomain',
      data: {
        tokenOrigin,
        expectedOrigin,
      },
    };
  }

  // Token is for a completely different origin - this is always wrong in static HTML
  // (Third-party tokens should be injected at runtime, not hardcoded)
  return {
    valid: false,
    messageId: 'invalidOrigin',
    data: {
      tokenOrigin,
      expectedOrigin,
    },
  };
}

/**
 * Check if two URLs have the same origin
 * @param {string} a - First URL
 * @param {string} b - Second URL
 * @returns {boolean}
 */
function isSameOrigin(a, b) {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

/**
 * Check if b is a subdomain of a
 * @param {string} a - Parent domain URL
 * @param {string} b - Potential subdomain URL
 * @returns {boolean}
 */
function isSubdomain(a, b) {
  try {
    const urlA = new URL(a);
    const urlB = new URL(b);
    return urlB.host.endsWith(`.${urlA.host}`);
  } catch {
    return false;
  }
}
