# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-17

### Added

- Initial release of eslint-plugin-capo
- Modern flat config support (ESLint 9+)
- Nine validation rules based on capo.js:
  - `no-invalid-head-elements` - Disallow invalid elements in head
  - `require-title` - Require exactly one title element
  - `no-duplicate-base` - Disallow multiple base elements
  - `no-meta-csp` - Disallow CSP meta tags (performance)
  - `no-invalid-http-equiv` - Validate http-equiv meta tags
  - `valid-meta-viewport` - Ensure proper viewport configuration
  - `valid-charset` - Ensure UTF-8 encoding
  - `no-default-style` - Discourage default-style meta tag
  - `head-element-order` - Validate optimal element ordering based on capo.js weight hierarchy
- Five preset configurations:
  - `recommended` - Balanced rules for production
  - `strict` - All rules as errors
  - `performance` - Performance-focused rules
  - `accessibility` - Accessibility-focused rules
  - `ordering` - Element ordering validation
- Element ordering utilities with 11-tier weight hierarchy
- Support for `@html-eslint/parser` to parse HTML structure
- Comprehensive documentation and examples
- Test suite with example HTML files
- VS Code integration support

### Documentation

- Complete README with usage examples
- Rule documentation with examples
- VS Code setup guide
- Example HTML files demonstrating good and bad practices
- Rule documentation with examples
- CI/CD integration guide
