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

const PathResolver = require('../PathResolver');
const {fetchImageDimensions} = require('../fetchImageDimensions');
const {remove, insertAfter, createElement, firstChildByTag, nextNode} = require('../NodeUtils');

const DEFAULT_LAYOUT = 'intrinsic';
const LAYOUT_MIN_WIDTH = 320; // minimum mobile device screen width

/**
 * Markdown - ensures markdown compatibility for input HTML
 *
 * This transformer adds out-of-the-box markdown support. This allows
 * using AMP Optimizer to convert HTML documents created from Markdown
 * files into valid AMP. A typical conversion flow would be:
 *
 * README.md => HTML => AMP Optimizer => valid AMP
 *
 * The only thing this transformer does is converting `<img>` tags into
 * either `amp-img` or `amp-anim` tags. All other Markdown features are
 * already supported by AMP. The transformer will try to resolve image
 * dimensions from the actual files. Images larger than 320px will automatically
 * get an intrinsic layout. For image detection to work, an optional dependency
 * `probe-image-size` needs to be installed via NPM.
 *
 * This transformer supports the following options:
 *
 * - `markdown [Boolean]`: enables Markdown HTML support. Default is `false`.
 * - `imageBasePath`: specifies a base path used to resolve an image during build,
 *   this can be a file system path or URL prefix.You can also pass a function
 *   `(imgSrc, params) => '../img/' + imgSrc` for dynamically calculating the image path.

 */
class Markdown {
  constructor(config) {
    this.log = config.log;
    this.enabled = !!config.markdown;
    // used for resolving image files
    this.pathResolver = new PathResolver(config.imageBasePath);
  }
  async transform(tree, params) {
    if (!this.enabled) {
      return;
    }
    const html = firstChildByTag(tree, 'html');
    if (!html) {
      return;
    }
    const body = firstChildByTag(html, 'body');
    if (!body) {
      return;
    }
    let node = body;
    const promises = [];
    while (node) {
      const tmpNode = nextNode(node);
      if (node.tagName === 'img') {
        promises.push(this.transformImg(node, params));
      }
      node = tmpNode;
    }
    return Promise.all(promises);
  }

  async transformImg(imgNode, params) {
    const src = imgNode.attribs && imgNode.attribs.src;
    if (!src) {
      return;
    }
    const resolvedSrc = this.pathResolver.resolve(src, params);
    let dimensions;
    try {
      dimensions = await fetchImageDimensions(resolvedSrc);
    } catch (error) {
      this.log.warn(error.message);
      // don't convert images we cannot resolve
      return;
    }
    const ampImgOrAmpAnim = this.createAmpImgOrAmpAnim(dimensions, imgNode);
    insertAfter(imgNode.parent, ampImgOrAmpAnim, imgNode);
    remove(imgNode);
  }

  createAmpImgOrAmpAnim(dimensions, imgNode) {
    const ampType = dimensions.type === 'gif' ? 'amp-anim' : 'amp-img';
    const ampNode = createElement(ampType, imgNode.attribs);
    // keep height and width if already specified
    ampNode.attribs.width = imgNode.attribs.width || String(dimensions.width);
    ampNode.attribs.height = imgNode.attribs.height || String(dimensions.height);
    this.addLayout(ampNode, dimensions);
    return ampNode;
  }

  addLayout(node, dimensions) {
    if (dimensions.width < LAYOUT_MIN_WIDTH) {
      return;
    }
    node.attribs.layout = DEFAULT_LAYOUT;
  }
}

module.exports = Markdown;
