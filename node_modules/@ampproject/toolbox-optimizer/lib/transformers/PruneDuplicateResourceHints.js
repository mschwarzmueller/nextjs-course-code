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

const {firstChildByTag} = require('../NodeUtils');
const HINT_TAGS = new Set(['dns-prefetch', 'preconnect', 'prefetch', 'preload', 'prerender']);

/**
 * Removes duplicate browser resource hint link header directives.
 *
 * To avoid wasted requests for preloaded resources strip references to duplicate
 * items.
 */
class PruneDuplicateResourceHints {
  transform(tree) {
    const preloaded = new Map();
    const html = firstChildByTag(tree, 'html');
    if (!html) {
      return;
    }
    const head = firstChildByTag(html, 'head');
    if (!head) {
      return;
    }
    const childNodes = [];
    for (let node = head.firstChild; node !== null; node = node.nextSibling) {
      if (this._notPruneableHintLink(node)) {
        childNodes.push(node);
      } else if (!this._alreadyLoaded(node, preloaded)) {
        this._markPreloaded(node, preloaded);
        childNodes.push(node);
      }
    }
    // replace the child node list
    head.childNodes = childNodes;
  }

  _notPruneableHintLink(node) {
    if (node.tagName !== 'link') {
      return true;
    }
    if (!node.attribs) {
      return true;
    }
    if (!node.attribs.rel) {
      return true;
    }
    if (!node.attribs.href) {
      return true;
    }
    if (node.attribs.rel === 'preload' && !node.attribs.as) {
      return true;
    }
    return !HINT_TAGS.has(node.attribs.rel);
  }

  _alreadyLoaded(link, preloaded) {
    const rel = link.attribs.rel;
    const href = link.attribs.href;
    if (!preloaded.has(href)) {
      return false;
    }
    const relations = preloaded.get(href);
    return relations.has(rel);
  }

  _markPreloaded(link, preloaded) {
    const rel = link.attribs.rel;
    const href = link.attribs.href;
    let relations = preloaded.get(href);
    if (!relations) {
      relations = new Set();
      preloaded.set(href, relations);
    }
    relations.add(rel);
  }
}

module.exports = PruneDuplicateResourceHints;
