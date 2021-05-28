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

const parseSizes = require('../parseSizes');
const {appendChild, createElement, insertText, hasAttribute} = require('../NodeUtils');
const {isCustomElement} = require('../Extensions.js');
const ID_PREFIX = 'i-amp-';

/**
 * Transforms a media attribute into CSS by negating the existing media query.
 */
class MediaTransformer {
  constructor() {
    this.media = new Map();
  }

  transform(node, id) {
    // normalize whitespace
    let mediaString = node.attribs.media.replace(/\s+/g, ' ');
    mediaString = mediaString.trim();
    if (!mediaString) {
      return false;
    }

    if (mediaString[0] === '(') {
      mediaString = `all and ${mediaString}`;
    }

    if (mediaString.startsWith('not ')) {
      mediaString = mediaString.substring(4);
    } else {
      mediaString = `not ${mediaString}`;
    }

    this.addMedia(mediaString, `#${id}`);
    return true;
  }

  addMedia(mediaQuery, id) {
    let ids = this.media.get(mediaQuery);
    if (!ids) {
      ids = [];
      this.media.set(mediaQuery, ids);
    }
    ids.push(id);
  }

  toString() {
    let result = '';
    for (const [media, selectors] of this.media.entries()) {
      result += `@media ${media}{${selectors.join(',')}{display:none}}`;
    }
    return result;
  }
}

/**
 * Transforms a sizes attribute into CSS by creating media queries for each size.
 */
class SizesTransformer {
  constructor() {
    this.sizes = [];
  }

  transform(node, id) {
    if (!node.attribs.srcset) {
      // According to the Mozilla docs, a sizes attribute without a valid srcset attribute should have no effect.
      // Therefore, it should simply be stripped, without producing media queries.
      // @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
      return false;
    }
    const sizes = parseSizes(node.attribs.sizes);
    if (!sizes.defaultValue) {
      // remove the sizes attribute as it's invalid anyway
      return false;
    }
    this.addSizes(id, sizes);
    return true;
  }

  addSizes(id, sizes) {
    this.sizes.push({
      id,
      defaultSize: sizes.defaultValue,
      // The user agent will pick a width from the sizes attribute, using the first item with a <media-condition> (the part in parentheses) that evaluates to true.
      // This means, we have to reverse the order the media queries in CSS to emulate this behavior (the last definition has precedence).
      sizes: sizes.values.reverse(),
    });
  }

  toString() {
    let result = '';
    for (const {sizes, defaultSize, id} of this.sizes) {
      const selector = `#${id}`;
      result += `${selector}{width:${defaultSize}}`;
      for (const size of sizes) {
        result += `@media ${size.media}{${selector}{width:${size.size}}}`;
      }
    }
    return result;
  }
}

/**
 * Transforms a heights attribute into CSS by creating media queries for each height.
 */
class HeightsTransformer {
  constructor() {
    this.heights = [];
  }

  transform(node, id) {
    const heights = parseSizes(node.attribs.heights);
    if (!heights.defaultValue) {
      // remove the sizes attribute as it's invalid anyway
      return false;
    }
    this.addHeights(id, heights);
    return true;
  }

  addHeights(id, heights) {
    this.heights.push({
      id,
      defaultHeight: heights.defaultValue,
      // The user agent will pick a width from the sizes attribute, using the first item with a <media-condition> (the part in parentheses) that evaluates to true.
      // This means, we have to reverse the order the media queries in CSS to emulate this behavior (the last definition has precedence).
      heights: heights.values.reverse(),
    });
  }

  toString() {
    let result = '';
    for (const {heights, defaultHeight, id} of this.heights) {
      const selector = `#${id}>:first-child`;
      result += `${selector}{padding-top:${defaultHeight}}`;
      for (const height of heights) {
        result += `@media ${height.media}{${selector}{padding-top:${height.size}}}`;
      }
    }
    return result;
  }
}

/**
 * Stateful attribute transformer. Can only be invoked once per page.
 */
class ApplyCommonAttributes {
  constructor(log) {
    this.log = log;
    this.canRemoveBoilerplate = true;
    // node counter for id generation
    this.counter = 0;
    // nodes to check for attributes
    this.nodesToTransform = [];
    // existing ids in the document
    this.ids = new Set();
    // nodes that have been transformed
    this.transformedNodes = [];
    this.attributeTransformations = {
      media: new MediaTransformer(),
      sizes: new SizesTransformer(),
      heights: new HeightsTransformer(),
    };
  }

  /**
   * Adds a body node to potentially be transformed later.
   *
   * @param {Node} node
   */
  addNode(node) {
    if (!node.attribs) {
      return;
    }
    // Record the id to be able to generate ids later
    if (hasAttribute(node, 'id')) {
      this.ids.add(node.attribs.id);
    }
    if (isCustomElement(node)) {
      this.nodesToTransform.push(node);
    }
  }

  /**
   * Applies attribute transformations to the selected node.
   */
  apply() {
    for (const node of this.nodesToTransform) {
      for (const [attribute, transformer] of Object.entries(this.attributeTransformations)) {
        if (hasAttribute(node, attribute)) {
          try {
            const id = this.getOrCreateId(node);
            const nodeHasBeenTransformed = transformer.transform(node, id);
            this.transformedNodes.push(node);
            if (nodeHasBeenTransformed && !node.attribs.id) {
              // Only update id if it's needed...
              node.attribs.id = id;
            } else {
              // Decrease counter otherwise
              this.counter--;
            }
          } catch (e) {
            this.log.debug(
              `Cannot remove boilerplate. Failed transforming ${attribute}="${node.attribs[attribute]}".`,
              e
            );
            this.canRemoveBoilerplate = false;
          }
        }
      }
    }
  }

  /**
   * Inject custom CSS resulting for attribute transformation.
   *
   * @param {Node} head - the head for injecting a styles node if none exists yet
   * @param {Node|undefined} customStyles - optional existing styles node
   */
  applyToCustomStyles(head, customStyles) {
    const styles = Object.values(this.attributeTransformations).join('');
    if (!styles) {
      return;
    }
    if (!customStyles) {
      customStyles = createElement('style', {
        'amp-custom': '',
      });
      appendChild(head, customStyles);
    }
    if (customStyles.children.length === 0) {
      insertText(customStyles, '');
    }
    customStyles.children[0].data += styles;
    for (const node of this.transformedNodes) {
      for (const attribute of Object.keys(this.attributeTransformations)) {
        delete node.attribs[attribute];
      }
    }
  }

  /**
   * Returns an existing id or generates a new one.
   *
   * @param {Node} node
   */
  getOrCreateId(node) {
    if (hasAttribute(node, 'id')) {
      return node.attribs.id;
    }
    node.attribs = node.attribs || [];
    const id = ID_PREFIX + this.counter;
    this.counter++;
    if (this.ids.has(id)) {
      // generate a new id if this one already exists
      return this.getOrCreateId(node);
    }
    return id;
  }
}

module.exports = ApplyCommonAttributes;
