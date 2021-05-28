/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
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
 * Finds and returns the first 'meta charset' element in the head.
 *
 * @param {Node} head the section to search for the meta charset node.
 * @returns {Node} the '<meta charset>' node or null.
 */
function findMetaViewport(head) {
  for (let node = head.firstChild; node !== null; node = node.nextSibling) {
    if (node.tagName === 'meta' && node.attribs.name === 'viewport') {
      return node;
    }
  }
  return null;
}

/**
 * Skips the subtree that is descending from the current node.
 * @param {Node} the node that has its subtree being skipped
 * @return {Node} the appropriate "next" node that will skip the current
 * subtree.
 */
function skipNodeAndChildren(node) {
  if (node.nextSibling) {
    return node.nextSibling;
  }
  return skipNodeAndChildren(node.parent);
}

/** @module HtmlDomHelper */
module.exports = {
  findMetaViewport: findMetaViewport,
  skipNodeAndChildren: skipNodeAndChildren,
};
