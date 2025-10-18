# no-invalid-origin-trial

Disallow invalid or expired origin trial tokens.

🔧 This rule provides automatic fixes for expired, invalid, or empty tokens by removing the entire meta tag.

## Background

Origin Trials allow developers to test experimental web platform features in production environments before they become part of the web standard. These trials use tokens that are:

- **Time-limited**: Each token has an expiration date
- **Origin-bound**: Tokens are tied to specific domains
- **Feature-specific**: Each token enables a specific experimental feature

Origin trial tokens are included in HTML using a meta tag:

```html
<meta http-equiv="origin-trial" content="TOKEN_HERE" />
```

This rule validates that origin trial tokens are:

1. Present and not empty
2. Properly formatted and decodable
3. Not expired
4. **Optionally**: Match a specified production origin

**Note on third-party tokens**: Third-party origin trial tokens (tokens for a different origin) are typically injected at runtime by the third-party script itself, not hardcoded in static HTML. If origin validation is enabled and a token is for a different origin than expected, this likely indicates a configuration error.

## Options

This rule accepts an options object with the following properties:

- `origin` (string, optional): The expected production origin (e.g., `"https://example.com"`). When provided, the rule will validate that the token's origin matches or is compatible with the expected origin.

```json
{
  "capo/no-invalid-origin-trial": [
    "error",
    {
      "origin": "https://example.com"
    }
  ]
}
```

## Rule Details

This rule checks `<meta http-equiv="origin-trial">` tags and reports errors for:

- Missing `content` attribute
- Empty or whitespace-only tokens
- Malformed tokens that cannot be decoded
- Expired tokens
- **Origin mismatch** (when `origin` option is provided):
  - Token origin doesn't match expected origin
  - Subdomain token without `isSubdomain` flag

### Automatic Fixes

This rule can automatically fix the following issues by removing the entire meta tag:

- Missing `content` attribute
- Empty tokens
- Invalid/malformed tokens
- Expired tokens

**Note**: The rule never modifies the token itself, only removes the problematic meta tag. Origin mismatch errors do not provide automatic fixes since they may require obtaining a new token rather than removing the tag.

Examples of **incorrect** code:

```html
<!-- eslint capo/no-invalid-origin-trial: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <!-- Missing content attribute -->
    <meta http-equiv="origin-trial" />

    <!-- Empty token -->
    <meta http-equiv="origin-trial" content="" />

    <!-- Invalid token format -->
    <meta http-equiv="origin-trial" content="not-a-valid-token" />

    <!-- Expired token (expired January 1, 2024) -->
    <meta http-equiv="origin-trial" content="AuD7QZu5VWZh..." />

    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

With origin validation:

```html
<!-- eslint capo/no-invalid-origin-trial: ["error", { "origin": "https://example.com" }] -->

<!DOCTYPE html>
<html>
  <head>
    <!-- Token for wrong origin -->
    <meta http-equiv="origin-trial" content="TOKEN_FOR_DIFFERENT_ORIGIN" />

    <!-- Subdomain token without isSubdomain flag -->
    <meta http-equiv="origin-trial" content="TOKEN_FOR_SUBDOMAIN_WITHOUT_FLAG" />

    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

Examples of **correct** code:

```html
<!-- eslint capo/no-invalid-origin-trial: "error" -->

<!DOCTYPE html>
<html>
  <head>
    <!-- Valid token with future expiry date -->
    <meta http-equiv="origin-trial" content="AwD7QZu5VWZh1S7cLpAQ9IqL0RkVuT0E..." />

    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

With origin validation:

```html
<!-- eslint capo/no-invalid-origin-trial: ["error", { "origin": "https://example.com" }] -->

<!DOCTYPE html>
<html>
  <head>
    <!-- Token matches expected origin -->
    <meta http-equiv="origin-trial" content="TOKEN_FOR_EXAMPLE_COM" />

    <!-- Subdomain token with proper isSubdomain flag -->
    <meta http-equiv="origin-trial" content="TOKEN_FOR_SUBDOMAIN_WITH_FLAG" />

    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

    <!-- Dynamic token (cannot be validated at lint time) -->
    <meta http-equiv="origin-trial" content={originTrialToken}>

    <title>My Page</title>

  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

## When Not to Use It

You might disable this rule if:

- You're intentionally committing an expired token that will be updated later
- Your tokens are generated dynamically at build time or runtime
- You're working with a token registration/management system that handles expiration

## How to Fix Violations

1. **Missing or empty token**: Add a valid origin trial token from the [Chrome Origin Trials console](https://developer.chrome.com/origintrials/)

2. **Invalid token**: Verify the token was copied correctly and is not corrupted

3. **Expired token**: Generate a new token from the Chrome Origin Trials console:
   - Go to https://developer.chrome.com/origintrials/
   - Register for the feature you want to test
   - Copy the new token
   - Replace the expired token in your HTML

## Origin Trial Resources

- [Chrome Origin Trials Guide](https://developer.chrome.com/docs/web-platform/origin-trials/)
- [Origin Trials Developer Console](https://developer.chrome.com/origintrials/)
- [Origin Trial Token Decoder](https://glitch.com/~ot-decode) - Tool to inspect token contents
- [capo.js validation rules](https://github.com/rviscomi/capo.js)

## Token Structure

Origin trial tokens are base64-encoded and contain:

- Origin (e.g., "https://example.com")
- Feature name (e.g., "WebGPU")
- Expiry date (Unix timestamp)
- Signature and other metadata

This rule decodes the token to validate its structure and expiry date, but cannot verify the origin or signature at lint time.
