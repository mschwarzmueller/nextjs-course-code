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

const {createElement, nextNode, insertAfter, firstChildByTag} = require('../NodeUtils');
const {findMetaViewport, skipNodeAndChildren} = require('../HtmlDomHelper');

// Maximum number of images that will be preloaded.
const MAX_PRELOADED_IMAGES = 5;

/**
 * PreloadImages - Adds preload instructions to the first 5 amp-img tags on the page, that don't use srcset.
 *
 * AMP requires the usage of `amp-img` for images instead of the regular `img` tag. Since
 * `amp-img` tags are custom elements, the AMP Runtime needs to be loaded before the images
 * are requested from the server.
 *
 * By issuing preload instructions, browsers will start downloading the images before the AMP
 * runtime is loaded, resulting on an earlier complete render.
 *
 * This transformer supports the following option:
 *
 * * `imagePreloadCount`: specifies the maxinum number of images to preload. The default is 5.
 */
class PreloadImages {
  transform(root, params) {
    const imagePreloadCount = params.imagePreloadCount || MAX_PRELOADED_IMAGES;
    const html = firstChildByTag(root, 'html');
    const head = firstChildByTag(html, 'head');
    const body = firstChildByTag(html, 'body');
    const preloadImageMap = new Map();

    let node = body;
    while (node !== null) {
      // We've hit the maximum number of preloads.
      if (preloadImageMap.size >= imagePreloadCount) {
        break;
      }
      if (node.tagName === 'template') {
        node = skipNodeAndChildren(node);
      } else {
        this.addImage(preloadImageMap, node);
        node = nextNode(node);
      }
    }

    let referenceNode = findMetaViewport(head);

    for (const preload of preloadImageMap.values()) {
      insertAfter(head, preload, referenceNode);
      referenceNode = preload;
    }
  }

  addImage(preloadImageMap, node) {
    const imageUrl = this.extractImageUrl(node);
    if (!imageUrl) {
      return;
    }
    // If srcset is used, skip preloading as we don't know which image will be used.
    if (node.attribs.srcset) {
      return;
    }
    preloadImageMap.set(imageUrl, this.createPreload(imageUrl, node.attribs.media));
  }

  extractImageUrl(node) {
    if (!node.attribs) {
      return null;
    }
    if (node.tagName === 'amp-img') {
      return node.attribs.src;
    }
    if (node.tagName === 'amp-video') {
      return node.attribs.poster;
    }
    return null;
  }

  createPreload(href, media) {
    const preload = createElement('link', {
      rel: 'preload',
      href: href,
      as: 'image',
    });
    if (media) {
      preload.attribs.media = media;
    }
    return preload;
  }
}

/** @module PreloadImages */
module.exports = PreloadImages;
