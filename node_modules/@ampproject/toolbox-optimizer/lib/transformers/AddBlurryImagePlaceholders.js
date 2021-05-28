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

const isDependencyInstalled = require('../isDependencyInstalled');

const {createElement, appendChild, nextNode, firstChildByTag} = require('../NodeUtils');
const {URL} = require('url');

const {skipNodeAndChildren} = require('../HtmlDomHelper');
const PathResolver = require('../PathResolver');

const PIXEL_TARGET = 60;
const MAX_BLURRED_PLACEHOLDERS = 100;
const DEFAULT_CACHED_PLACEHOLDERS = 30;
const CACHE_ALL_PLACEHOLDERS = -1;

const ESCAPE_TABLE = {
  '#': '%23',
  '%': '%25',
  ':': '%3A',
  '<': '%3C',
  '>': '%3E',
  '"': "'",
};
const ESCAPE_REGEX = new RegExp(Object.keys(ESCAPE_TABLE).join('|'), 'g');
function escaper(match) {
  return ESCAPE_TABLE[match];
}

/**
 * Adds placeholders for certain amp-img's and posters for amp-videos that are
 * blurry versions of the corresponding original source. The blur will be
 * displayed as the <amp-img> is rendering, and will fade out once the element
 * is loaded. The current requirements of appending a blurry placeholder is for
 * the element is to be a JPEG that is either responsive or a poster for an
 * amp-video.
 *
 * This transformer supports the following option:
 *
 * * `blurredPlaceholders`: Enables blurry image placeholder generation. Default is `false`.
 * * `imageBasePath`: specifies a base path used to resolve an image during build. You can
 *    also pass a function `(imgSrc, params) => '../img/' + imgSrc` for calculating the image path.
 * * `maxBlurredPlaceholders`: Specifies the max number of blurred images. Defaults to 5.
 * * `blurredPlaceholdersCacheSize`: Specifies the max number of blurred images to be cached
 *   to avoid expensive recalculation. Set to 0 if caching should be disabled. Set to -1 if
 *   all placeholders should be cached (good for static sites). Defaults to 30.
 *
 * Important: blurry image placeholder computation is expensive. Make sure to
 * only use it for static or cached pages.
 */
class AddBlurryImagePlaceholders {
  constructor(config) {
    this.log_ = config.log.tag('AddBlurryImagePlaceholders');

    // setup implementation only if placeholder generation is enabled
    this.blurredPlaceholders_ = !!config.blurredPlaceholders;
    if (!this.blurredPlaceholders_) {
      this.log_.debug('disabled');
      return;
    }

    // check whether all required dependencies are installed
    if (!isDependencyInstalled('jimp') || !isDependencyInstalled('lru-cache')) {
      this.log_.warn(
        'jimp and lru-cache need to be installed via `npm install jimp lru-cache` ' +
          'for this transformer to work'
      );
      // we can't generate placeholders
      this.blurredPlaceholders_ = false;
      return;
    }
    this.jimp = require('jimp');

    // use provided upper placeholder limit for fallback to default
    this.maxBlurredPlaceholders_ = config.maxBlurredPlaceholders || MAX_BLURRED_PLACEHOLDERS;
    // used for resolving image files
    this.pathResolver_ = new PathResolver(config.imageBasePath);

    // setup caching
    const maxCacheSize = config.blurredPlaceholdersCacheSize || DEFAULT_CACHED_PLACEHOLDERS;
    // use a Map if all placeholders should be cached
    if (maxCacheSize === CACHE_ALL_PLACEHOLDERS) {
      this.log_.debug('caching all placeholders');
      this.cache_ = new Map();
    } else if (maxCacheSize > 0) {
      const LRU = require('lru-cache');
      this.log_.debug('using LRU cache for regularily used placeholders', maxCacheSize);
      // use a LRU cache otherwise
      this.cache_ = new LRU({
        max: maxCacheSize,
      });
    } else {
      this.log_.debug('caching disabled');
    }
  }

  /**
   * Parses the document to add blurred placedholders in all appropriate
   * locations.
   * @param {Object} runtime parameters
   * @return {Array} An array of promises that all represents the resolution of
   * a blurred placeholder being added in an appropriate place.
   */
  transform(root, params) {
    // Check if placeholders should be generated
    if (!this.blurredPlaceholders_) {
      return;
    }
    const html = firstChildByTag(root, 'html');
    const body = firstChildByTag(html, 'body');
    const promises = [];
    let placeholders = 0;
    for (let node = body; node !== null; node = nextNode(node)) {
      const {tagName} = node;
      let src;
      if (tagName === 'template') {
        node = skipNodeAndChildren(node);
        continue;
      }
      if (tagName === 'amp-img') {
        src = node.attribs.src;
      }
      if (tagName === 'amp-video' && node.attribs.poster) {
        src = node.attribs.poster;
      }

      if (this.shouldAddBlurryPlaceholder_(node, src, tagName)) {
        placeholders++;
        const promise = this.addBlurryPlaceholder_(src, params).then((img) => {
          node.attribs.noloading = '';
          appendChild(node, img);
        });
        promises.push(promise);

        if (placeholders >= this.maxBlurredPlaceholders_) {
          break;
        }
      }
    }

    return Promise.all(promises);
  }

  /**
   * Adds a child image that is a blurry placeholder.
   * @param {String} src The image that the bitmap is based on.
   * @return {!Promise} A promise that signifies that the img has been updated
   * to have correct attributes to be a blurred placeholder along with the
   * placeholder itself.
   * @private
   */
  async addBlurryPlaceholder_(src, params) {
    const img = createElement('img', {
      class: 'i-amphtml-blurry-placeholder',
      placeholder: '',
      src,
      alt: '',
    });
    try {
      const dataURI = await this.getCachedDataURI(src, params);
      let svg = `<svg xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 ${dataURI.width} ${dataURI.height}">
                      <filter id="b" color-interpolation-filters="sRGB">
                        <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
                        <feComponentTransfer>
                          <feFuncA type="discrete" tableValues="1 1"></feFuncA>
                        </feComponentTransfer>
                      </filter>
                      <image filter="url(#b)" x="0" y="0"
                        height="100%" width="100%"
                        xlink:href="${dataURI.src}">
                      </image>
                    </svg>`;

      // Optimizes dataURI length by deleting line breaks, and
      // removing unnecessary spaces.
      svg = svg.replace(/\s+/g, ' ');
      svg = svg.replace(/> </g, '><');
      svg = svg.replace(ESCAPE_REGEX, escaper);

      img.attribs.src = 'data:image/svg+xml;charset=utf-8,' + svg;
      this.log_.debug(src, '[SUCCESS]');
    } catch (err) {
      this.log_.debug(src, '[FAIL]');
      this.log_.error(err.message);
    }
    return img;
  }

  /**
   * Returns a cached dataURI if exists, otherwise creates a new one.
   */
  getCachedDataURI(src, params) {
    const resolvedSrc = this.pathResolver_.resolve(src, params);
    if (this.cache_) {
      const dataURIPromise = this.cache_.get(resolvedSrc);
      if (dataURIPromise) {
        this.log_.debug(src, '[CACHE HIT]');
        return dataURIPromise;
      }
      this.log_.debug(src, '[CACHE MISS]');
    }
    const dataURIPromise = this.getDataURI_(resolvedSrc);
    if (this.cache_) {
      // we cache the promise to ensure that multiple requests for the same image
      // still use the cache
      this.cache_.set(resolvedSrc, dataURIPromise);
    }
    return dataURIPromise;
  }

  /**
   * Creates the bitmap in a dataURI format.
   * @param {string} the img src value
   * placeholder.
   * @return {!Promise} A promise that is resolved once the img's src is updated
   * to be a dataURI of a bitmap including width and height.
   * @private
   */
  async getDataURI_(src) {
    const image = await this.jimp.read(src);
    const imgDimension = this.getBitmapDimensions_(image.bitmap.width, image.bitmap.height);
    image.resize(imgDimension.width, imgDimension.height, this.jimp.RESIZE_BEZIER);
    const result = {
      src: await image.getBase64Async('image/png'),
      width: imgDimension.width,
      height: imgDimension.height,
    };
    return result;
  }

  /**
   * Calculates the correct dimensions for the bitmap.
   * @param {Node} img The DOM element that will need a bitmap.
   * placeholder.
   * @return {Record} The aspect ratio of the bitmap of the image.
   * @private
   */
  getBitmapDimensions_(imgWidth, imgHeight) {
    // Aims for a bitmap of ~P pixels (w * h = ~P).
    // Gets the ratio of the width to the height. (r = w0 / h0 = w / h)
    const ratioWH = imgWidth / imgHeight;
    // Express the width in terms of height by multiply the ratio by the
    // height. (h * r = (w / h) * h)
    // Plug this representation of the width into the original equation.
    // (h * r * h = ~P).
    // Divide the bitmap size by the ratio to get the all expressions using
    // height on one side. (h * h = ~P / r)
    let bitmapHeight = PIXEL_TARGET / ratioWH;
    // Take the square root of the height instances to find the singular value
    // for the height. (h = sqrt(~P / r))
    bitmapHeight = Math.sqrt(bitmapHeight);
    // Divide the goal total pixel amount by the height to get the width.
    // (w = ~P / h).
    const bitmapWidth = PIXEL_TARGET / bitmapHeight;
    return {width: Math.round(bitmapWidth), height: Math.round(bitmapHeight)};
  }

  /**
   * Checks if an element has a placeholder.
   * @param {Node} node The DOM element that is being checked for a placeholder.
   * @return {boolean} Whether or not the element already has a placeholder
   * child.
   * @private
   */
  hasPlaceholder_(node) {
    return (
      node.childNodes.find((child) => {
        return child.attribs && child.attribs.placeholder !== undefined;
      }) !== undefined
    );
  }

  /**
   * Checks if an image should have a blurred image placeholder.
   * The current criteria for determining if a blurry image placeholder should
   * be appended is as follows:
   * - The source for the image should be a JPEG.
   * - If the element is:
   *    - an amp-img using a responsive layout (responsive, fill or intrinsic)
   *    - an amp-video with a poster
   *
   * This criteria was found to be the most common places where a blurry image
   * placeholder would likely want to be used through manual examination of
   * existing AMP pages.
   * @param {Node} node The DOM element that is being checked to see if it
   * should have a blurred placeholder.
   * @param {string} src The image source that is being checked.
   * @param {string} tagName The type of element that is being checked.
   * @return {boolean} Whether or not the element should have a blurred
   * placeholder child.
   * @private
   */
  shouldAddBlurryPlaceholder_(node, src, tagName) {
    // Ensures current placeholders are not overridden.
    if (!src) {
      return false;
    }
    if (this.hasPlaceholder_(node)) {
      return false;
    }

    // Non-JPEG images are not commonly featured in a role where blurred
    // image placeholders would be wanted.
    const url = new URL(src, 'https://example.com');
    if (!url.pathname.endsWith('.jpg') && !url.pathname.endsWith('jpeg')) {
      return false;
    }

    // Images or videos with noloading attributes should not have any indicators that they
    // are loading.
    if (node.attribs.noloading != null) {
      return false;
    }

    // Checks if the image is a poster or a responsive image as these are the
    // two most common cases where blurred placeholders would be wanted.
    const isPoster = tagName == 'amp-video';
    const isResponsiveImgWithLoading =
      tagName == 'amp-img' &&
      (node.attribs.layout == 'intrinsic' ||
        node.attribs.layout == 'responsive' ||
        node.attribs.layout == 'fill');
    return isPoster || isResponsiveImgWithLoading;
  }
}

/** @module AddBlurryImagePlaceholders */
module.exports = AddBlurryImagePlaceholders;
