# Rules

This directory contains detailed documentation for each rule in eslint-plugin-capo.

## Available Rules

### Validity Rules

These rules catch common mistakes and invalid HTML in the `<head>` element:

- [no-invalid-head-elements](./no-invalid-head-elements.md) - Disallow invalid elements in the HTML head
- [require-title](./require-title.md) - Require a title element in the head
- [no-duplicate-title](./no-duplicate-title.md) - Disallow multiple title elements in the head
- [no-duplicate-base](./no-duplicate-base.md) - Disallow multiple base elements in the head
- [valid-charset](./valid-charset.md) - Ensure proper UTF-8 character encoding is declared

### Performance Rules

These rules help optimize page load performance:

- [no-meta-csp](./no-meta-csp.md) - Disallow CSP meta tags that disable the preload scanner
- [no-default-style](./no-default-style.md) - Disallow the default-style meta tag
- [head-element-order](./head-element-order.md) - Validate that head elements are in optimal order for performance

### Accessibility Rules

These rules ensure your pages are accessible to all users:

- [valid-meta-viewport](./valid-meta-viewport.md) - Ensure viewport meta tag is properly configured for accessibility
- [require-meta-viewport](./require-meta-viewport.md) - Require a viewport meta tag in the head

### Best Practices

These rules help you follow modern web standards:

- [no-invalid-http-equiv](./no-invalid-http-equiv.md) - Disallow invalid or deprecated http-equiv meta tags

## Rule Categories

### Recommended (✅)

These rules are enabled in the `recommended` configuration:

- `no-invalid-head-elements`
- `require-title`
- `no-duplicate-title`
- `no-duplicate-base`
- `no-meta-csp`
- `no-invalid-http-equiv`
- `valid-meta-viewport`
- `valid-charset`
- `no-default-style`
- `require-meta-viewport`

### Optional

These rules are useful but not enabled by default:

- `head-element-order` - Can be noisy for existing projects; enable explicitly if you want ordering validation

## Documentation Structure

Each rule documentation follows this structure:

1. **Rule Name** - The name of the rule
2. **Brief Description** - One-line summary
3. **Background** - Context and rationale for the rule
4. **Rule Details** - Detailed explanation with examples
5. **When Not to Use It** - Valid reasons to disable the rule
6. **Prior Art** - Links to related standards and tools

## Contributing

If you find issues with the documentation or have suggestions for improvements, please [open an issue](https://github.com/rviscomi/eslint-plugin-capo/issues) or submit a pull request.
