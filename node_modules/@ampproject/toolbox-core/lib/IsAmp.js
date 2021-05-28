/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
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

const HTML_START = '<html';

/**
 * Returns if the string is an AMP document.
 *
 * @param {string} string
 * @returns {boolean}
 */
module.exports = function isAmp(string) {
  let start = string.indexOf(HTML_START);
  if (start === -1) {
    return false;
  }
  start += HTML_START.length;
  const end = string.indexOf('>', start);
  if (end === -1) {
    return false;
  }
  let attrs = string.substring(start, end).split(/\s+/);
  attrs = attrs.map((a) => a.split('=')[0]);
  return attrs.includes('amp') || attrs.includes('⚡');
};
