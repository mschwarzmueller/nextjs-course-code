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

const {insertText, hasAttribute, firstChildByTag} = require('../NodeUtils');

/**
 * AmpBoilerplateTransformer - This DOM transformer adds
 * https://cdn.ampproject.org/v0.css if server-side-rendering is applied
 * (known by the presence of <style amp-runtime> tag). AMP runtime css (v0.css)
 * will always be inlined as it'll get automatically updated to the latest version
 * once the AMP runtime has loaded.
 */
class AmpBoilerplateTransformer {
  constructor(config) {
    this.fetch_ = config.fetch;
    this.runtimeVersion_ = config.runtimeVersion;
    this.log_ = config.log.tag('AmpBoilerplateTransformer');
  }

  transform(root, params) {
    const html = firstChildByTag(root, 'html');
    const head = firstChildByTag(html, 'head');
    if (!head) {
      return; // invalid doc
    }
    // amp-runtime is added by server-side-rendering
    const ampRuntimeStylesNode = this._findAmpRuntimeStyle(head);
    if (!ampRuntimeStylesNode) {
      return; // keep existing boilerplate
    }
    // inline CSS
    let {ampRuntimeVersion, ampRuntimeStyles} = params;
    if (!ampRuntimeVersion || !ampRuntimeStyles) {
      // these should be set by DomTransformer
      this.log_.error(
        'Missing parameters both ampRuntimeVersion and ampRuntimeStyles need to be present'
      );
      return;
    }
    ampRuntimeStylesNode.attribs['i-amphtml-version'] = ampRuntimeVersion;
    insertText(ampRuntimeStylesNode, ampRuntimeStyles);
  }

  _findAmpRuntimeStyle(head) {
    let node = head.firstChild;
    while (node) {
      if (hasAttribute(node, 'amp-runtime')) {
        return node;
      }
      node = node.nextSibling;
    }
    return null;
  }
}

module.exports = AmpBoilerplateTransformer;
