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

const {
  appendChild,
  createElement,
  hasAttribute,
  insertAfter,
  nextNode,
  firstChildByTag,
} = require('../NodeUtils');
const {findMetaViewport, skipNodeAndChildren} = require('../HtmlDomHelper');
const {isValidImageSrcURL} = require('../URLUtils');
const amphtml = require('../AmpConstants');

// Images smaller than 150px are considered tiny
const TINY_IMG_THRESHOLD = 150;
// Maximum number of hero images defined via data-hero
const DATA_HERO_MAX = 2;

/**
 * PreloadHeroImage - this transformers optimizes image rendering times for hero images. For hero
 * images it will:
 *
 * 1. Inject a preload hint (if possible)
 * 2. Generate an img tag enabling the browser to render the image without the AMP runtime being loaded.
 *
 * Hero images are either identified automatically or can be explicitly defined by adding an `data-hero`
 * attribute to the element.
 *
 * This transformer supports the following options:
 *
 * * `preloadHeroImage`: [true|false] - enables or disables hero image preloading. The default is `true`.
 */
class PreloadHeroImage {
  constructor(config) {
    this.log = config.log;
    this.enabled = config.preloadHeroImage !== false;
  }

  async transform(root, params) {
    if (!this.enabled || params.preloadHeroImage === false) {
      return;
    }
    const html = firstChildByTag(root, 'html');
    const head = firstChildByTag(html, 'head');
    const body = firstChildByTag(html, 'body');
    if (!body || !head) return;

    const heroImages = this.findHeroImages(body);
    let referenceNode = findMetaViewport(head);

    let heroImageCount = heroImages.length;
    if (heroImageCount > DATA_HERO_MAX) {
      this.log.warn(
        `Found ${heroImageCount} hero elements on the page. AMP currently only supports a maximum of ${DATA_HERO_MAX} elements.`
      );
      heroImageCount = DATA_HERO_MAX;
    }
    const isAmpStory = amphtml.isAmpStory(head);
    for (let i = 0; i < heroImageCount; i++) {
      const heroImage = heroImages[i];
      this.generatePreload(heroImage, head, referenceNode);
      // AMP Stories don't support ssr'd amp-img yet
      // See https://github.com/ampproject/amphtml/issues/29850
      if (!isAmpStory) {
        this.generateImg(heroImage.ampImg);
      }
    }
  }

  generatePreload(heroImage, head, referenceNode) {
    if (heroImage.srcset) {
      this.log.debug(
        "Could not preload hero image as it's using srcset, which is currently only supported Chromium-based browsers (see https://web.dev/preload-responsive-images/).",
        heroImage.src
      );
      return;
    }
    if (this.hasExistingImagePreload(head, heroImage.src)) {
      return;
    }
    const preload = createElement('link', {
      'rel': 'preload',
      'href': heroImage.src,
      'as': 'image',
      'data-hero': '',
    });
    if (heroImage.media) {
      preload.attribs.media = heroImage.media;
    }
    insertAfter(head, preload, referenceNode);
  }

  hasExistingImagePreload(head, src) {
    return head.children.some((node) => {
      if (node.tagName !== 'link') {
        return false;
      }
      if (!hasAttribute(node, 'rel')) {
        return false;
      }
      if (node.attribs.rel !== 'preload') {
        return false;
      }
      if (node.attribs.as !== 'image') {
        return false;
      }
      return node.attribs.href === src;
    });
  }

  findHeroImages(root) {
    let heroImageCandidate = null;
    let heroImages = [];
    let node = root;
    // Walk over all nodes in the body
    while (node !== null) {
      // Look for data-hero attribute
      this.addImageWithDataHero(node, heroImages);
      // Auto detect a hero image in case data-hero is not used
      if (!heroImageCandidate && heroImages.length === 0) {
        heroImageCandidate = this.isCandidateHeroImage(node);
      }
      if (amphtml.isTemplate(node)) {
        // Ignore images inside templates
        node = skipNodeAndChildren(node);
      } else {
        node = nextNode(node);
      }
    }
    // Optimize data-hero element if defined
    if (heroImages.length > 0) {
      return heroImages;
    }
    // Fallback to auto detected hero image if available
    if (heroImageCandidate) {
      return [heroImageCandidate];
    }
    // No hero images to optimize
    return [];
  }

  addImageWithDataHero(node, heroImages) {
    if (node.tagName === 'amp-img' && hasAttribute(node, 'data-hero')) {
      const {src, media, srcset} = node.attribs;
      heroImages.push({
        ampImg: node,
        src,
        media,
        srcset,
      });
    } else if (this.isAmpIframe(node) && hasAttribute(node, 'data-hero')) {
      const placeholder = this.getPlaceholderImage(node);
      if (placeholder) {
        heroImages.push(placeholder);
      }
    }
  }

  isCandidateHeroImage(node) {
    if (!node.tagName) {
      return null;
    }
    const layout = node.attribs ? node.attribs.layout : '';
    if (layout === 'nodisplay') {
      return null;
    }
    if (node.tagName === 'amp-img') {
      return this.isCandidateImageForPreloading(node);
    }
    if (node.tagName === 'amp-video') {
      return this.isCandidateVideoPosterImage(node);
    }
    if (this.isAmpIframe(node)) {
      return this.isCandidateIframePlaceholderImage(node);
    }
    return null;
  }

  isAmpIframe(node) {
    return node.tagName === 'amp-iframe' || node.tagName === 'amp-video-iframe';
  }

  // For a given <amp-video> node or any node that has poster attribute, and
  // qualifies as hero image, returns the HeroImageSrcs.
  isCandidateVideoPosterImage(ampVideo) {
    const poster = ampVideo.attribs.poster;
    if (!poster) return null;
    if (!isValidImageSrcURL(poster)) {
      return null;
    }

    const {layout, width, height, media} = ampVideo.attribs;
    if (this.isTinyNode(layout, width, height)) {
      return null;
    }
    return {src: poster, media, srcset: ''};
  }

  isCandidateIframePlaceholderImage(ampIframe) {
    // Placeholder amp-img is required to preload image for iframe.
    if (!ampIframe.children || ampIframe.children.length === 0) {
      return null;
    }

    const {layout, width, height} = ampIframe.attribs;

    if (this.isTinyNode(layout, width, height)) return null;

    return this.getPlaceholderImage(ampIframe);
  }

  getPlaceholderImage(ampIframe) {
    for (const child of ampIframe.children) {
      if (
        child.tagName === 'amp-img' &&
        hasAttribute(child, 'placeholder') &&
        isValidImageSrcURL(child.attribs.src)
      ) {
        return {
          ampImg: child,
          src: child.attribs.src,
          media: ampIframe.attribs.media,
          srcset: child.attribs.srcset || '',
        };
      }
    }
    return null;
  }

  // Checks if node qualifies to be a hero image. Returns HeroImageSrcs if the
  // node is a hero image. The hero image here can come from one of <amp-img>,
  // <amp-video>, <amp-iframe>, <amp-video-iframe>.
  isCandidateImageForPreloading(ampImg) {
    const src = ampImg.attribs.src;
    if (!src) {
      return null;
    }
    if (!isValidImageSrcURL(src)) {
      return null;
    }

    let {width, height, srcset, layout, media} = ampImg.attribs;

    if (!width && !height) {
      if (layout === 'fill') {
        ({width, height} = this.nodeDimensionsFromParent(ampImg));
      } else {
        return null;
      }
    }
    if (this.isTinyNode(layout, width, height)) {
      return null;
    }
    return {ampImg, src, srcset, media};
  }

  // Any node with width or height less than 150 pixels and a non-responsive layout.
  isTinyNode(layout, width, height) {
    if (width <= 0 || height <= 0) return true;
    if (layout === 'intrinsic' || layout === 'responsive') {
      return false;
    }
    return width < TINY_IMG_THRESHOLD || height < TINY_IMG_THRESHOLD;
  }

  nodeDimensionsFromParent(node) {
    while (node.parent) {
      node = node.parent;
      if (!node.attribs) {
        continue;
      }
      const width = node.attribs.width;
      const height = node.attribs.height;
      if (!width && !height) {
        continue;
      }
      return {width, height};
    }
    return {width: 0, height: 0};
  }

  generateImg(node) {
    if (!node) {
      return;
    }
    const imgNode = createElement('img', {
      class: 'i-amphtml-fill-content i-amphtml-replaced-content',
      decoding: 'async',
    });
    const attributesToCopy = [
      'alt',
      'attribution',
      'object-fit',
      'object-position',
      'referrerpolicy',
      'src',
      'srcset',
      'sizes',
      'title',
    ];
    for (const attr of attributesToCopy) {
      if (hasAttribute(node, attr)) {
        imgNode.attribs[attr] = node.attribs[attr];
      }
    }
    node.attribs['i-amphtml-ssr'] = '';
    node.attribs['data-hero'] = '';
    appendChild(node, imgNode);
  }
}

/** @module PreloadHeroImage */
module.exports = PreloadHeroImage;
