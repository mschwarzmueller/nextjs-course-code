/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * A sizes object.
 * @typedef {{
 *   values: (Array<Size>),
 *   defaultValue: string
 * }}
 */
// eslint-disable-next-line
let Sizes;

/**
 * A single size definition.
 * @typedef {{
 *   media: string,
 *   size: string
 * }}
 */
// eslint-disable-next-line
let Size;

/**
 * Parses the text representation of sizes into Sizes object.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes.
 * See https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-sizes
 * See https://html.spec.whatwg.org/multipage/images.html#parsing-a-sizes-attribute
 *
 * @param {String} string
 * @returns {Sizes}
 */
const parseSizes = (string) => {
  const result = {
    defaultValue: '',
    values: [],
  };
  if (!string) {
    return result;
  }
  const sizes = string.trim().split(/\s*,\s*/);
  for (let i = 0; i < sizes.length; i++) {
    const sizeString = sizes[i];
    if (i === sizes.length - 1) {
      result.defaultValue = sizeString.trim();
    } else {
      const size = sizeString.split(/\)\s+/);
      if (size.length !== 2) {
        throw new Error(`Invalid sizes definition '${string}'`);
      }
      result.values.push({
        media: `${size[0]})`,
        size: size[1],
      });
    }
  }
  return result;
};

module.exports = parseSizes;
