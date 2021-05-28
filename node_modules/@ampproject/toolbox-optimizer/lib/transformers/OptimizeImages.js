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

const {hasAttribute, nextNode, firstChildByTag} = require('../NodeUtils');
const {skipNodeAndChildren} = require('../HtmlDomHelper');
const {isValidImageSrcURL} = require('../URLUtils');

// Don't generate srcset's for images with width smaller than MIN_WIDTH_TO_ADD_SRCSET_IN_RESPONSIVE_LAYOUT
// this avoids generating srcsets for images with a responsive layout where width/height define the aspect ration.
const MIN_WIDTH_TO_ADD_SRCSET_IN_RESPONSIVE_LAYOUT = 100;

// All supported srcset widths.
const SRCSET_WIDTH = [
  39,
  47,
  56,
  68,
  82,
  100,
  120,
  150,
  180,
  220,
  270,
  330,
  390,
  470,
  560,
  680,
  820,
  1000,
  1200,
  1440,
  1750,
  2000,
  2500,
];

// Don't generate srcsets for images larger than the supported maximum
const MAX_IMG_SIZE = SRCSET_WIDTH[SRCSET_WIDTH - 1];

// The maximum number of srcset source. We'll take the initial image width and generate more width values by
// multiplying by multiples of 1.0 up the given max value (e.g. width=300, maxSrcsetValues=3 => 1 * 300, 2 * 300, 3 * 300)
// and match the result to the closest supported srcset width (see above).
const MAX_SRCSET_VALUE_COUNT = 3;

/**
 * Calculates the srcset width for a given image width.
 */
class SrcsetWidth {
  constructor(imgSrcWidth, maxImgWidth = -1, maxSrcsetValues = MAX_SRCSET_VALUE_COUNT) {
    this.widthList_ = [];
    this.setBaseWidth(imgSrcWidth, maxImgWidth, maxSrcsetValues);
  }

  /**
   * Sets the base width, i.e., renderered dimension measured in CSS pixels.
   * Returns true if srcset is needed, that is, we'll resize the image to at
   * least 2 supported widths (@see SRCSET_WIDTH for a list of supported widths).
   *
   * If maxImgWidth is provided the actual image size in srcset will not
   * exceed this value. So if maxImgWidth is 820, the srcset will not
   * contain any image greater than 820px. The maxImgWidth is not absolute
   * number but depends on the aspect ratio. So if 650 is maxImgWidth, the
   * nearest aspect ratio width for this max width is 620.
   *
   * @param {Number} imgSrcWidth
   * @param {Number} maxImgWidth
   */
  setBaseWidth(imgSrcWidth, maxImgWidth = -1, maxSrcsetValues = MAX_SRCSET_VALUE_COUNT) {
    this.widthList_.length = 0;
    let previousWidth = -1;
    if (maxImgWidth > 0 && imgSrcWidth > maxImgWidth) {
      return;
    }

    for (let i = maxSrcsetValues; i > 0; --i) {
      let width = this.roundUp(imgSrcWidth * i);
      if (maxImgWidth > 0 && width > maxImgWidth) {
        width = maxImgWidth;
      }
      if (width != previousWidth) {
        this.widthList_.push(width);
      }

      previousWidth = width;
    }
  }

  /**
   *  Returns true if there are more width values.
   */
  moreWidth() {
    return this.widthList_.length > 0;
  }

  /**
   * Returns the current legitimate width and moves the state to the next one.
   */
  nextWidth() {
    return this.widthList_.pop();
  }

  /**
   *
   */
  isValid() {
    return this.widthList_.length > 1;
  }

  roundUp(value) {
    for (const width of SRCSET_WIDTH) {
      if (width > value) {
        return width;
      }
    }
    return SRCSET_WIDTH[SRCSET_WIDTH.length - 1];
  }
}

/**
 * ImageTransformer - generates srcset attribute for amp-img.
 *
 * This transformer requires the following option:
 *
 * - `imageOptimizer`: a function for customizing the srcset generation. The function should return a URL
 *    pointing to a version of the `src` image with the given `width`. If no image is available, it should
 *    return a falsy value. For example: (src, width) => `${src}?width=${width}`.
 */
class OptimizeImages {
  constructor(config) {
    this.log = config.log;
    this.imageOptimizer = config.imageOptimizer;
    // TODO turn these into options https://github.com/ampproject/amp-toolbox/issues/804
    this.maxImageWidth = MAX_IMG_SIZE;
    this.maxSrcsetValues = MAX_SRCSET_VALUE_COUNT;
  }

  async transform(root) {
    if (!this.imageOptimizer) {
      return;
    }
    const html = firstChildByTag(root, 'html');
    const body = firstChildByTag(html, 'body');

    let node = body;
    const imageOptimizationPromises = [];
    while (node !== null) {
      if (node.tagName === 'template') {
        node = skipNodeAndChildren(node);
      } else {
        if (node.tagName === 'amp-img') {
          imageOptimizationPromises.push(this.optimizeImage(node));
        }
        node = nextNode(node);
      }
    }
    return Promise.all(imageOptimizationPromises);
  }

  async optimizeImage(imageNode) {
    // Don't change existing srcsets.
    if (hasAttribute(imageNode, 'srcset')) {
      return;
    }
    // Should not happen for valid AMP.
    if (!hasAttribute(imageNode, 'src')) {
      return;
    }
    const src = imageNode.attribs.src;
    // Check if it's a relative path or a valid http(s) URL.
    if (!isValidImageSrcURL(src)) {
      return;
    }

    // No srcset is added if the image ends with a `,` (comma). See
    // http://b/127535381 for context.
    if (src.endsWith(',')) {
      return;
    }
    const width = imageNode.attribs.width;

    // TODO(b/113271759): Handle width values that include 'px' (probably others).
    if (isNaN(Number.parseInt(width))) {
      // No width or invalid width.
      return;
    }

    // Determine if the layout is "responsive".
    const {layout, height, sizes} = imageNode.attribs;
    const isResponsive = layout === 'responsive' || (!layout && height && sizes);

    // In responsive layout, width and height might be used for indicating
    // the aspect ratio instead of the actual render dimensions. This usually
    // happens for dimensions of small values.
    if (isResponsive && width < MIN_WIDTH_TO_ADD_SRCSET_IN_RESPONSIVE_LAYOUT) {
      return;
    }

    // We add srcset only when the CSS dimensions correspond to 2 or more
    // unique legitimate physical dimensions.
    const srcsetWidth = new SrcsetWidth(width, this.maxImageWidth, this.maxSrcsetValues);
    if (!srcsetWidth.isValid()) {
      return;
    }
    // Generate the srcset.
    let srcset = '';
    while (srcsetWidth.moreWidth()) {
      const nextWidth = srcsetWidth.nextWidth();
      try {
        // Generate the width specific image URL using the default or custom srcset generator.
        const nextSrc = await this.imageOptimizer(src, nextWidth);
        // Add the width (if supported) to the srcset.
        if (nextSrc) {
          srcset += `${nextSrc} ${nextWidth}w${srcsetWidth.moreWidth() ? ', ' : ''}`;
        }
      } catch (e) {
        this.log.error('Exception when optimizing image', src, e);
      }
    }
    if (srcset) {
      imageNode.attribs.srcset = srcset;
      this.log.debug('Generating img srcset', src, imageNode.attribs.srcset);
    }
  }
}

module.exports = OptimizeImages;
