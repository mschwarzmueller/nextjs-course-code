# AMP-Toolbox Script CSP


[![npm version](https://badge.fury.io/js/%40ampproject%2Ftoolbox-script-csp.svg)](https://badge.fury.io/js/%40ampproject%2Ftoolbox-script-csp)

Calculates the [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
hash for the given script in the format expected by [`amp-script`](https://amp.dev/documentation/components/amp-script/).

CSP is required when using `amp-script` with inline or cross-origin scripts.

## Usage

Install via:

```
$ npm install @ampproject/toolbox-script-csp
```

### Using the module

The module exposes a single function, `calculateHash(src, options?)`.

`src` can be either a string (in which case UTF8 encoding is assumed) or a
[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
such as a [`Buffer`](https://nodejs.org/api/buffer.html).

`options` is used to override the default options.

#### Options

*   `algorithm` overrides the hashing algorithm to use. Currently, the only
    algorithm supported by `amp-script` is `sha384` which is the default value.

### Example

Here is an example on how to use the `calculateHash` function to generate an
`amp-script` CSP header.

Note that both leading and trailing whitespace is included in calculating the
hash and must exactly match the whitespace used in the inline script.

```javascript
const {calculateHash} = require('@ampproject/toolbox-script-csp');

const script = `
    const subject = 'world';
    console.log('Hello, ' + subject);
    `;

const hash = calculateHash(script);

console.log(hash);  // sha384-xRxb5sv13at6tVgZET4JLmf89TSZP10HjCGXVqO9bKWVXB0asV2jLrsDN8v4zX6j
```

The generated hash can be used in a `<meta>` tag this way:

```html
<!doctype html>
<html ⚡>
<head>
  ...

  <meta name="amp-script-src" content="sha384-xRxb5sv13at6tVgZET4JLmf89TSZP10HjCGXVqO9bKWVXB0asV2jLrsDN8v4zX6j">
</head>
  <body>
    ...

    <amp-script layout="container" script="example"></amp-script>

    <script id="example" type="text/plain" target="amp-script">
    const subject = 'world';
    console.log('Hello, ' + subject);
    </script>
  </body>
</html>
```
