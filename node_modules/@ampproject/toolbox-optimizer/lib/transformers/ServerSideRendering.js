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

const {
  hasAttribute,
  remove,
  createElement,
  insertBefore,
  nextNode,
  firstChildByTag,
} = require('../NodeUtils');
const {isRenderDelayingExtension, isCustomElement} = require('../Extensions.js');
const {applyLayout} = require('./ApplyLayout.js');
const ApplyCommonAttributes = require('./ApplyCommonAttributes');

class ServerSideRendering {
  constructor(config) {
    this.log_ = config.log.tag('ServerSideRendering');
  }
  // Determines whether the node |n| has an enclosing ancestor tag
  // identified as |tagname|.
  _hasAncestorWithTag(n, tagname) {
    for (let p = n.parent; p !== null; p = p.parent) {
      if (p.tagName === tagname) {
        return true;
      }
    }
    return false;
  }

  transform(root) {
    const applyCommonAttributes = new ApplyCommonAttributes(this.log_);
    const html = firstChildByTag(root, 'html');
    if (!html) {
      return;
    }
    const body = firstChildByTag(html, 'body');
    const head = firstChildByTag(html, 'head');

    // A simple check ensuring that the Server-side rendering is only applied once.
    if (
      typeof html.attribs['i-amphtml-layout'] !== 'undefined' &&
      html.attribs['i-amphtml-layout'] !== null
    ) {
      return;
    }
    html.attribs['i-amphtml-layout'] = '';

    // Within the loop we apply the layout to the custom tags (amp-foo...)
    // where possible, but while we're at this we also look for reasons
    // not to remove the boilerplate.
    let canRemoveBoilerplate = true;
    for (let node = body; node; node = nextNode(node)) {
      applyCommonAttributes.addNode(node);
      // Skip tags that are not AMP custom elements.
      if (!isCustomElement(node)) {
        continue;
      }

      // Skip tags inside a template tag.
      if (this._hasAncestorWithTag(node, 'template')) {
        continue;
      }

      // amp-experiment is a render delaying extension iff the tag is used in
      // the doc. We check for that here rather than checking for the existence
      // of the amp-experiment script in IsRenderDelayingExtension below.
      if (node.tagName === 'amp-experiment' && this.isAmpExperimentUsed(node)) {
        canRemoveBoilerplate = false;
        this.log_.debug('cannot remove boilerplate: amp-experiment');
      }

      // amp-audio requires knowing the dimensions of the browser. Do not
      // remove the boilerplate or apply layout if amp-audio is present in the
      // document.
      if (node.tagName === 'amp-audio') {
        canRemoveBoilerplate = false;
        this.log_.debug('cannot remove boilerplate: amp-audio');
        continue;
      }

      // Now apply the layout to the custom elements. If we encounter
      // any unsupported layout, the applyLayout function returns
      // false and we can't remove the boilerplate.
      if (!applyLayout(node, this.log_)) {
        this.log_.debug('cannot remove boilerplate: unsupported layout');
        canRemoveBoilerplate = false;
        continue;
      }
    }

    // Transform media, sizes and heights attributes
    // Important: this needs to run after applyLayout.
    applyCommonAttributes.apply();

    // Emit the amp-runtime marker to indicate that we're applying
    // server side rendering in the document.
    const ampRuntimeMarker = createElement('style', {
      'amp-runtime': '',
    });

    const referenceNode = head.children && head.children.length ? head.children[0] : null;
    insertBefore(head, ampRuntimeMarker, referenceNode);

    let customStyles;
    for (let node = head.firstChild; node; node = node.nextSibling) {
      // amp-experiment is a render delaying extension iff the tag is used in
      // the doc, which we checked for above.
      if (
        node.tagName === 'script' &&
        hasAttribute(node, 'custom-element') &&
        node.attribs['custom-element'] === 'amp-experiment'
      ) {
        continue;
      }
      if (isRenderDelayingExtension(node)) {
        this.log_.debug(
          'cannot remove boilerplate because of a render delaying extension: ',
          node.tagName
        );
        canRemoveBoilerplate = false;
      }
      if (hasAttribute(node, 'amp-custom')) {
        customStyles = node;
      }
    }
    // Add attribute styles to the custom-styles and remove the attributes
    applyCommonAttributes.applyToCustomStyles(head, customStyles);
    if (!applyCommonAttributes.canRemoveBoilerplate) {
      canRemoveBoilerplate = false;
    }

    // Below, we're only concerned about removing the boilerplate.
    // If we've already determined that we can't, we're done here.
    if (!canRemoveBoilerplate) {
      return;
    }

    // The boilerplate can be removed, note it on the <html> tag.
    html.attribs['i-amphtml-no-boilerplate'] = '';

    // Find the boilerplate and remove it.
    // The following code assumes that the <noscript>
    // tag in the head is only ever used for boilerplate.
    const toRemove = [];
    for (let node = head.firstChild; node; node = node.nextSibling) {
      if (
        node.tagName === 'noscript' ||
        (node.tagName === 'style' && hasAttribute(node, 'amp-boilerplate'))
      ) {
        toRemove.push(node);
      }
    }

    for (const n of toRemove) {
      remove(n);
    }
  }

  isAmpExperimentUsed(ampExperimentNode) {
    let script;
    for (const child of ampExperimentNode.children || []) {
      if (
        child.tagName === 'script' &&
        child.attribs &&
        child.attribs['type'] === 'application/json'
      ) {
        script = child;
        break;
      }
    }
    // If not script/json tag, then not used.
    if (!script) {
      return false;
    }
    // If not exactly one child is present, then not used.
    if (script.children.length !== 1) {
      return false;
    }
    // If child is not a textnode, then not used.
    const scriptChild = script.firstChild;
    if (scriptChild.type !== 'text') {
      return false;
    }
    // If textnode is not JSON parsable, then not used.
    try {
      const parsedJson = JSON.parse(scriptChild.data);
      // If JSON is empty, then not used.
      return typeof parsedJson === 'object' && Object.keys(parsedJson).length > 0;
    } catch (e) {
      // invalid JSON
      return false;
    }
  }
}

module.exports = ServerSideRendering;
