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
 * A sample implementation that does not perform any kind of image optimization, but generates a `srcset` string
 * by appending the width to the file name (e.g. image.jpg => image.32w.jpg).
 *
 * @param {string} src - the image src
 * @param {number} width - the required widths (in px)
 * @returns {string|undefined} - the image URL or undefined if no image is available in this dimension
 */
const simpleRename = (src, width) => {
  // we cannot rename if the image does not have a file extension
  const index = src.lastIndexOf('.');
  if (index === -1) {
    return null;
  }
  const prefix = src.substring(0, index);
  const postfix = src.substring(index, src.length);
  return `${prefix}.${width}w${postfix}`;
};

module.exports = simpleRename;
