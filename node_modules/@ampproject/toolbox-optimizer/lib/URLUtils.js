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
 * Returns true if the string specifies an image src URL (relative or absolute using http or https).
 *
 * @param {string} src the input string
 * @returns {boolean}
 */
const isValidImageSrcURL = (src) => {
  try {
    return new URL(src, 'https://example.com').protocol.startsWith('http');
  } catch (e) {
    // invalid URL
    return false;
  }
};

module.exports = {
  isValidImageSrcURL,
};
