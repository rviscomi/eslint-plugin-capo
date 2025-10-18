/**
 * Validation helper utilities for capo ESLint plugin
 * Based on https://github.com/rviscomi/capo.js/blob/main/src/lib/validation.js
 */

export const VALID_HEAD_ELEMENTS = new Set([
  'base',
  'link',
  'meta',
  'noscript',
  'script',
  'style',
  'template',
  'title',
]);

export const CONTENT_TYPE_SELECTOR = 'meta[http-equiv="content-type" i], meta[charset]';
export const HTTP_EQUIV_SELECTOR = 'meta[http-equiv]';
export const PRELOAD_SELECTOR = 'link[rel="preload" i], link[rel="modulepreload" i]';

/**
 * Check if element tag is valid in head
 */
export function isValidHeadElement(tagName) {
  return VALID_HEAD_ELEMENTS.has(tagName.toLowerCase());
}

/**
 * Check if element is a CSP meta tag
 */
export function isMetaCSP(node) {
  if (node.name !== 'meta') return false;

  const httpEquiv = getAttributeValue(node, 'http-equiv');
  if (!httpEquiv) return false;

  return httpEquiv.toLowerCase().includes('content-security-policy');
}

/**
 * Check if element is an origin trial meta tag
 */
export function isOriginTrial(node) {
  if (node.name !== 'meta') return false;

  const httpEquiv = getAttributeValue(node, 'http-equiv');
  if (!httpEquiv) return false;

  return httpEquiv.toLowerCase() === 'origin-trial';
}

/**
 * Check if element is a meta viewport tag
 */
export function isMetaViewport(node) {
  if (node.name !== 'meta') return false;

  const name = getAttributeValue(node, 'name');
  if (!name) return false;

  return name.toLowerCase() === 'viewport';
}

/**
 * Check if element is a default-style meta tag
 */
export function isDefaultStyle(node) {
  if (node.name !== 'meta') return false;

  const httpEquiv = getAttributeValue(node, 'http-equiv');
  if (!httpEquiv) return false;

  return httpEquiv.toLowerCase() === 'default-style';
}

/**
 * Check if element is a content-type or charset meta tag
 */
export function isContentType(node) {
  if (node.name !== 'meta') return false;

  const httpEquiv = getAttributeValue(node, 'http-equiv');
  const hasCharset = node.attributes?.some((attr) => {
    // Support both @html-eslint/parser (key.value) and vue-eslint-parser (key.name)
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'charset';
  });

  return httpEquiv?.toLowerCase() === 'content-type' || hasCharset;
}

/**
 * Check if element has http-equiv attribute
 */
export function isHttpEquiv(node) {
  if (node.name !== 'meta') return false;
  return node.attributes?.some((attr) => {
    // Support both @html-eslint/parser (key.value) and vue-eslint-parser (key.name)
    const keyName = attr.key?.value || attr.key?.name;
    return keyName?.toLowerCase() === 'http-equiv';
  });
}

/**
 * Check if element is a preload link
 */
export function isPreload(node) {
  if (node.name !== 'link') return false;

  const rel = getAttributeValue(node, 'rel');
  if (!rel) return false;

  const relLower = rel.toLowerCase();
  return relLower === 'preload' || relLower === 'modulepreload';
}

/**
 * Get attribute value from an AST node
 */
export function getAttributeValue(node, attrName) {
  if (!node.attributes) return null;

  const attr = node.attributes.find((a) => {
    // Support both @html-eslint/parser (key.value) and vue-eslint-parser (key.name)
    const keyName = a.key?.value || a.key?.name;
    return keyName?.toLowerCase() === attrName.toLowerCase();
  });

  if (!attr?.value) return null;

  // Handle different value types
  // @html-eslint/parser uses AttributeValue
  if (attr.value.type === 'AttributeValue') {
    return attr.value.value;
  }
  // vue-eslint-parser uses Literal or VLiteral
  if (attr.value.type === 'Literal' || attr.value.type === 'VLiteral') {
    return attr.value.value;
  }

  return null;
}

/**
 * Validate CSP meta tag
 */
export function validateCSP(node, context) {
  const warnings = [];
  const httpEquiv = getAttributeValue(node, 'http-equiv');

  if (httpEquiv?.toLowerCase() === 'content-security-policy-report-only') {
    warnings.push('CSP Report-Only is forbidden in meta tags');
    return warnings;
  }

  if (httpEquiv?.toLowerCase() === 'content-security-policy') {
    warnings.push(
      'CSP meta tags disable the preload scanner due to a bug in Chrome. Use the CSP header instead. Learn more: https://crbug.com/1458493'
    );
  }

  const content = getAttributeValue(node, 'content');
  if (!content) {
    warnings.push('Invalid CSP. The content attribute must be set.');
    return warnings;
  }

  const directives = {};
  content.split(/\s*;\s*/).forEach((directive) => {
    const [key, ...value] = directive.split(' ');
    directives[key] = value.join(' ');
  });

  if ('report-uri' in directives) {
    warnings.push(
      'The report-uri directive is not supported. Use the Content-Security-Policy-Report-Only HTTP header instead.'
    );
  }
  if ('frame-ancestors' in directives) {
    warnings.push(
      'The frame-ancestors directive is not supported. Use the Content-Security-Policy HTTP header instead.'
    );
  }
  if ('sandbox' in directives) {
    warnings.push('The sandbox directive is not supported. Use the Content-Security-Policy HTTP header instead.');
  }

  return warnings;
}

/**
 * Valid http-equiv values that actually work (even if discouraged)
 */
export const VALID_HTTP_EQUIV_VALUES = [
  'content-security-policy',
  'content-security-policy-report-only',
  'origin-trial',
  'content-type',
  'default-style',
  'refresh',
  'x-dns-prefetch-control',
  'accept-ch',
  'delegate-ch',
];

/**
 * Check if an http-equiv value is valid (works, even if discouraged)
 */
export function isValidHttpEquiv(httpEquivValue) {
  if (!httpEquivValue) return false;
  return VALID_HTTP_EQUIV_VALUES.includes(httpEquivValue.toLowerCase());
}

/**
 * Validate http-equiv meta tag
 */
export function validateHttpEquiv(node) {
  const warnings = [];
  const type = getAttributeValue(node, 'http-equiv')?.toLowerCase();
  const content = getAttributeValue(node, 'content')?.toLowerCase();

  if (!type) return warnings;

  switch (type) {
    case 'content-security-policy':
    case 'content-security-policy-report-only':
    case 'origin-trial':
    case 'content-type':
    case 'default-style':
      // More specific validation exists
      break;

    case 'refresh':
      if (!content) {
        warnings.push(
          "This doesn't do anything. The content attribute must be set. However, using refresh is discouraged."
        );
        break;
      }
      if (content.includes('url=')) {
        warnings.push('Meta auto-redirects are discouraged. Use HTTP 3XX responses instead.');
      } else {
        warnings.push('Meta auto-refreshes are discouraged unless users have the ability to disable it.');
      }
      break;

    case 'x-dns-prefetch-control':
      if (content === 'on') {
        warnings.push(`DNS prefetching is enabled by default. Setting it to "${content}" has no effect.`);
      } else if (content !== 'off') {
        warnings.push(
          `This is a non-standard way of disabling DNS prefetching, which is a performance optimization. Found content="${content}". Use content="off" if you have a legitimate security concern, otherwise remove it.`
        );
      } else {
        warnings.push(
          'This is non-standard, however most browsers support disabling speculative DNS prefetching. It should still be noted that DNS prefetching is a generally accepted performance optimization and you should only disable it if you have specific security concerns.'
        );
      }
      break;

    case 'cache-control':
    case 'etag':
    case 'pragma':
    case 'expires':
    case 'last-modified':
      warnings.push("This doesn't do anything. Use HTTP headers for any cache directives.");
      break;

    case 'x-frame-options':
      warnings.push("This doesn't do anything. Use the CSP HTTP header with the frame-ancestors directive instead.");
      break;

    case 'x-ua-compatible':
    case 'content-style-type':
    case 'content-script-type':
    case 'imagetoolbar':
    case 'cleartype':
    case 'page-enter':
    case 'page-exit':
    case 'site-enter':
    case 'site-exit':
    case 'msthemecompatible':
    case 'window-target':
      warnings.push("This doesn't do anything. It was an Internet Explorer feature and is now deprecated.");
      break;

    case 'content-language':
    case 'language':
      warnings.push('This is non-conforming. Use the html[lang] attribute instead.');
      break;

    case 'set-cookie':
      warnings.push('This is non-conforming. Use the Set-Cookie HTTP header instead.');
      break;

    case 'application-name':
    case 'author':
    case 'description':
    case 'generator':
    case 'keywords':
    case 'referrer':
    case 'theme-color':
    case 'color-scheme':
    case 'viewport':
    case 'creator':
    case 'googlebot':
    case 'publisher':
    case 'robots':
      warnings.push(`This doesn't do anything. Did you mean \`meta[name=${type}]\`?`);
      break;

    case 'encoding':
      warnings.push("This doesn't do anything. Did you mean `meta[charset]`?");
      break;

    case 'title':
      warnings.push("This doesn't do anything. Did you mean to use the `title` tag instead?");
      break;

    case 'accept-ch':
    case 'delegate-ch':
      warnings.push('This is non-standard and may not work across browsers. Use HTTP headers instead.');
      break;

    default:
      warnings.push(
        'This is non-standard and may not work across browsers. http-equiv is not an alternative to HTTP headers.'
      );
      break;
  }

  return warnings;
}

/**
 * Validate meta viewport tag
 */
export function validateMetaViewport(node) {
  const warnings = [];
  const content = getAttributeValue(node, 'content')?.toLowerCase();

  if (!content) {
    warnings.push('Invalid viewport. The content attribute must be set.');
    return warnings;
  }

  const directives = {};
  content.split(',').forEach((directive) => {
    const [key, value] = directive.split('=');
    if (key) {
      directives[key.trim()] = value?.trim();
    }
  });

  if ('width' in directives) {
    const width = directives['width'];
    const numWidth = Number(width);
    if (!isNaN(numWidth) && (numWidth < 1 || numWidth > 10000)) {
      warnings.push(`Invalid width "${width}". Numeric values must be between 1 and 10000.`);
    } else if (width !== 'device-width' && isNaN(numWidth)) {
      warnings.push(`Invalid width "${width}".`);
    }
  }

  if ('height' in directives) {
    const height = directives['height'];
    const numHeight = Number(height);
    if (!isNaN(numHeight) && (numHeight < 1 || numHeight > 10000)) {
      warnings.push(`Invalid height "${height}". Numeric values must be between 1 and 10000.`);
    } else if (height !== 'device-height' && isNaN(numHeight)) {
      warnings.push(`Invalid height "${height}".`);
    }
  }

  if ('initial-scale' in directives) {
    const initialScale = Number(directives['initial-scale']);
    if (isNaN(initialScale)) {
      warnings.push(`Invalid initial zoom level "${directives['initial-scale']}". Values must be numeric.`);
    } else if (initialScale < 0.1 || initialScale > 10) {
      warnings.push(`Invalid initial zoom level "${initialScale}". Values must be between 0.1 and 10.`);
    }
  }

  if ('minimum-scale' in directives) {
    const minimumScale = Number(directives['minimum-scale']);
    if (isNaN(minimumScale)) {
      warnings.push(`Invalid minimum zoom level "${directives['minimum-scale']}". Values must be numeric.`);
    } else if (minimumScale < 0.1 || minimumScale > 10) {
      warnings.push(`Invalid minimum zoom level "${minimumScale}". Values must be between 0.1 and 10.`);
    }
  }

  if ('maximum-scale' in directives) {
    const maxScale = Number(directives['maximum-scale']);
    if (isNaN(maxScale)) {
      warnings.push(`Invalid maximum zoom level "${directives['maximum-scale']}". Values must be numeric.`);
    } else if (maxScale < 0.1 || maxScale > 10) {
      warnings.push(`Invalid maximum zoom level "${maxScale}". Values must be between 0.1 and 10.`);
    } else if (maxScale < 2) {
      warnings.push(`Disabling zoom levels under 2x can cause accessibility issues. Found "${maxScale}".`);
    }
  }

  if ('user-scalable' in directives) {
    const userScalable = directives['user-scalable'];
    if (userScalable === 'no' || userScalable === '0') {
      warnings.push(
        `Disabling zooming can cause accessibility issues to users with visual impairments. Found "${userScalable}".`
      );
    }
    if (!['0', '1', 'yes', 'no'].includes(userScalable)) {
      warnings.push(`Unsupported value "${userScalable}" found.`);
    }
  }

  if ('interactive-widget' in directives) {
    const interactiveWidget = directives['interactive-widget'];
    const validValues = ['resizes-visual', 'resizes-content', 'overlays-content'];
    if (!validValues.includes(interactiveWidget)) {
      warnings.push(`Unsupported value "${interactiveWidget}" found.`);
    }
  }

  if ('viewport-fit' in directives) {
    const viewportFit = directives['viewport-fit'];
    const validValues = ['auto', 'contain', 'cover'];
    if (!validValues.includes(viewportFit)) {
      warnings.push(`Unsupported value "${viewportFit}" found. Should be one of: ${validValues.join(', ')}.`);
    }
  }

  if ('shrink-to-fit' in directives) {
    warnings.push(
      'The shrink-to-fit directive has been obsolete since iOS 9.2. See https://www.scottohara.me/blog/2018/12/11/shrink-to-fit.html'
    );
  }

  const validDirectives = new Set([
    'width',
    'height',
    'initial-scale',
    'minimum-scale',
    'maximum-scale',
    'user-scalable',
    'interactive-widget',
    'viewport-fit',
    'shrink-to-fit',
  ]);

  Object.keys(directives).forEach((directive) => {
    if (!validDirectives.has(directive)) {
      warnings.push(`Invalid viewport directive "${directive}".`);
    }
  });

  return warnings;
}

/**
 * Validate content-type/charset meta tag
 */
export function validateContentType(node) {
  const warnings = [];

  const charset = getAttributeValue(node, 'charset') || extractCharsetFromContent(node);

  if (charset && charset.toLowerCase() !== 'utf-8') {
    warnings.push(
      `Documents are required to use UTF-8 encoding. Found "${charset}". Learn more: https://html.spec.whatwg.org/multipage/semantics.html#character-encoding-declaration`
    );
  }

  return warnings;
}

function extractCharsetFromContent(node) {
  const content = getAttributeValue(node, 'content');
  if (!content) return null;

  const charsetPattern = /text\/html;\s*charset=(.*)/i;
  const match = content.match(charsetPattern);
  return match?.[1]?.trim();
}

/**
 * Validate default-style meta tag
 */
export function validateDefaultStyle(node) {
  const warnings = [];

  const title = getAttributeValue(node, 'content');
  if (!title) {
    warnings.push('This has no effect. The content attribute must be set to a valid stylesheet title.');
  }

  warnings.push(
    'Even when used correctly, the default-style method of setting a preferred stylesheet results in a flash of unstyled content. Use modern CSS features like @media rules instead.'
  );

  return warnings;
}
