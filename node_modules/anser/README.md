
















# anser

A low level parser for ANSI sequences.




## Installation

```sh
$ npm i anser
```









## Example






```js
"use strict";

const Anser = require("anser");

const txt = "\u001b[38;5;196mHello\u001b[39m \u001b[48;5;226mWorld\u001b[49m";

console.log(Anser.ansiToHtml(txt));
// <span style="color:rgb(255, 0, 0)">Hello</span> <span style="background-color:rgb(255, 255, 0)">World</span>

console.log(Anser.ansiToHtml(txt, { use_classes: true }));
// <span class="ansi-palette-196-fg">Hello</span> <span class="ansi-palette-226-bg">World</span>

console.log(Anser.ansiToJson(txt));
// [ { content: '',
//     fg: null,
//     bg: null,
//     fg_truecolor: null,
//     bg_truecolor: null,
//     clearLine: undefined,
//     decoration: null,
//     was_processed: false,
//     isEmpty: [Function: isEmpty] },
//   { content: 'Hello',
//     fg: '255, 0, 0',
//     bg: null,
//     fg_truecolor: null,
//     bg_truecolor: null,
//     clearLine: false,
//     decoration: null,
//     was_processed: true,
//     isEmpty: [Function: isEmpty] },
//   { content: ' ',
//     fg: null,
//     bg: null,
//     fg_truecolor: null,
//     bg_truecolor: null,
//     clearLine: false,
//     decoration: null,
//     was_processed: false,
//     isEmpty: [Function: isEmpty] },
//   { content: 'World',
//     fg: null,
//     bg: '255, 255, 0',
//     fg_truecolor: null,
//     bg_truecolor: null,
//     clearLine: false,
//     decoration: null,
//     was_processed: true,
//     isEmpty: [Function: isEmpty] },
//   { content: '',
//     fg: null,
//     bg: null,
//     fg_truecolor: null,
//     bg_truecolor: null,
//     clearLine: false,
//     decoration: null,
//     was_processed: false,
//     isEmpty: [Function: isEmpty] } ]

```






## Documentation





### `Anser.escapeForHtml(txt)`
Escape the input HTML.

This does the minimum escaping of text to make it compliant with HTML.
In particular, the '&','<', and '>' characters are escaped. This should
be run prior to `ansiToHtml`.

#### Params
- **String** `txt`: The input text (containing the ANSI snippets).

#### Return
- **String** The escaped html.

### `Anser.linkify(txt)`
Adds the links in the HTML.

This replaces any links in the text with anchor tags that display the
link. The links should have at least one whitespace character
surrounding it. Also, you should apply this after you have run
`ansiToHtml` on the text.

#### Params
- **String** `txt`: The input text.

#### Return
- **String** The HTML containing the <a> tags (unescaped).

### `Anser.ansiToHtml(txt, options)`
This replaces ANSI terminal escape codes with SPAN tags that wrap the
content.

This function only interprets ANSI SGR (Select Graphic Rendition) codes
that can be represented in HTML.
For example, cursor movement codes are ignored and hidden from output.
The default style uses colors that are very close to the prescribed
standard. The standard assumes that the text will have a black
background. These colors are set as inline styles on the SPAN tags.

Another option is to set `use_classes: true` in the options argument.
This will instead set classes on the spans so the colors can be set via
CSS. The class names used are of the format `ansi-*-fg/bg` and
`ansi-bright-*-fg/bg` where `*` is the color name,
i.e black/red/green/yellow/blue/magenta/cyan/white.

#### Params
- **String** `txt`: The input text.
- **Object** `options`: The options passed to the ansiToHTML method.

#### Return
- **String** The HTML output.

### `Anser.ansiToJson(txt, options)`
Converts ANSI input into JSON output.

#### Params
- **String** `txt`: The input text.
- **Object** `options`: The options passed to the ansiToHTML method.

#### Return
- **String** The HTML output.

### `Anser.ansiToText(txt)`
Converts ANSI input into text output.

#### Params
- **String** `txt`: The input text.

#### Return
- **String** The text output.

### `Anser()`
The `Anser` class.

#### Return
- **Anser**

### `setupPalette()`
Sets up the palette.

### `escapeForHtml(txt)`
Escapes the input text.

#### Params
- **String** `txt`: The input text.

#### Return
- **String** The escpaed HTML output.

### `linkify(txt)`
Adds HTML link elements.

#### Params
- **String** `txt`: The input text.

#### Return
- **String** The HTML output containing link elements.

### `ansiToHtml(txt, options)`
Converts ANSI input into HTML output.

#### Params
- **String** `txt`: The input text.
- **Object** `options`: The options passed ot the `process` method.

#### Return
- **String** The HTML output.

### `ansiToJson(txt, options)`
Converts ANSI input into HTML output.

#### Params
- **String** `txt`: The input text.
- **Object** `options`: The options passed ot the `process` method.

#### Return
- **String** The JSON output.

### `ansiToText(txt)`
Converts ANSI input into HTML output.

#### Params
- **String** `txt`: The input text.

#### Return
- **String** The text output.

### `process(txt, options, markup)`
Processes the input.

#### Params
- **String** `txt`: The input text.
- **Object** `options`: An object passed to `processChunk` method, extended with:
 - `json` (Boolean): If `true`, the result will be an object.
 - `use_classes` (Boolean): If `true`, HTML classes will be appended to the HTML output.
- **Boolean** `markup`:

### `processChunkJson(text, options, markup)`
Processes the current chunk into json output.

#### Params
- **String** `text`: The input text.
- **Object** `options`: An object containing the following fields:
 - `json` (Boolean): If `true`, the result will be an object.
 - `use_classes` (Boolean): If `true`, HTML classes will be appended to the HTML output.
- **Boolean** `markup`: If false, the colors will not be parsed.

#### Return
- **Object** The result object:
 - `content` (String): The text.
 - `fg` (String|null): The foreground color.
 - `bg` (String|null): The background color.
 - `fg_truecolor` (String|null): The foreground true color (if 16m color is enabled).
 - `bg_truecolor` (String|null): The background true color (if 16m color is enabled).
 - `clearLine` (Boolean): `true` if a carriageReturn \r was fount at end of line.
 - `was_processed` (Bolean): `true` if the colors were processed, `false` otherwise.
 - `isEmpty` (Function): A function returning `true` if the content is empty, or `false` otherwise.

### `processChunk(text, options, markup)`
Processes the current chunk of text.

#### Params
- **String** `text`: The input text.
- **Object** `options`: An object containing the following fields:
 - `json` (Boolean): If `true`, the result will be an object.
 - `use_classes` (Boolean): If `true`, HTML classes will be appended to the HTML output.
- **Boolean** `markup`: If false, the colors will not be parsed.

#### Return
- **Object|String** The result (object if `json` is wanted back or string otherwise).






## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].



## License
See the [LICENSE][license] file.


[license]: /LICENSE
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
