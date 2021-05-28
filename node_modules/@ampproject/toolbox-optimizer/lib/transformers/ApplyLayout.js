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

const {hasAttribute, insertBefore, createElement, appendChild} = require('../NodeUtils');
const {
  parseLayout,
  cssLength,
  calculateHeight,
  calculateWidth,
  calculateLayout,
  getLayoutClass,
  isLayoutSizeDefined,
  getLayoutSizeDefinedClass,
} = require('../ParseLayout.js');

const SUPPORTED_LAYOUTS = [
  '',
  'nodisplay',
  'fixed',
  'fixed-height',
  'responsive',
  'container',
  'fill',
  'flex-item',
  'intrinsic',
];

function isSupportedLayout(layout) {
  return SUPPORTED_LAYOUTS.indexOf(layout) > -1;
}

function getAttributeOrNull(element, name) {
  return hasAttribute(element, name) ? element.attribs[name] : null;
}

function addClass(node, value) {
  node.attribs.class = hasAttribute(node, 'class') ? node.attribs.class + ' ' + value : value;
}

function apply(layout, width, height, node) {
  addClass(node, getLayoutClass(layout));
  if (isLayoutSizeDefined(layout)) {
    addClass(node, getLayoutSizeDefinedClass());
  }

  let styles = '';
  switch (layout) {
    case 'nodisplay':
      node.attribs.hidden = 'hidden';
      break;
    case 'fixed':
      styles = `width:${width.numeral}${width.unit};height:${height.numeral}${height.unit};`;
      break;
    case 'fixed-height':
      styles = `height:${height.numeral}${height.unit};`;
      break;
    case 'responsive':
      // Do nothing here, but emit <i-amphtml-sizer> later.
      break;
    case 'intrinsic':
      // Do nothing here, but emit <i-amphtml-sizer> later.
      break;
    case 'fill':
    case 'container':
      // Do nothing here.
      break;
    case 'flex-item':
      if (width.isSet) {
        styles = `width:${width.numeral}${width.unit};`;
      }
      if (height.isSet) {
        styles += `height:${height.numeral}${height.unit};`;
      }
      break;
    default:
    // Do nothing.
  }
  // We prepend just in case an existing value (which shouldn't be there for
  // valid docs) doesn't end with ';'.
  node.attribs.style = styles + (node.attribs.style ? node.attribs.style : '');
  if (node.attribs.style === '') {
    delete node.attribs.style;
  }

  node.attribs['i-amphtml-layout'] = layout;
}

function maybeAddSizerInto(node, layout, width, height) {
  if (!width.isSet || width.numeral === 0 || !height.isSet || width.unit !== height.unit) {
    return;
  }
  let sizer = null;
  if (layout === 'responsive') {
    sizer = createResponsiveSizer(width, height);
  } else if (layout === 'intrinsic') {
    sizer = createIntrinsicSizer(width, height);
  }
  if (sizer) {
    const referenceNode = node.firstChild;
    insertBefore(node, sizer, referenceNode);
  }
}

function createResponsiveSizer(width, height) {
  const padding = (height.numeral / width.numeral) * 100;
  const sizer = createElement('i-amphtml-sizer', {
    style: `display:block;padding-top:${parseFloat(padding.toFixed(4))}%`,
  });
  return sizer;
}

function createIntrinsicSizer(width, height) {
  // Intrinsic uses an svg inside the sizer element rather than the padding
  // trick Note a naked svg won't work because other things expect the
  // i-amphtml-sizer element
  const sizer = createElement('i-amphtml-sizer', {
    class: 'i-amphtml-sizer',
  });
  const sizerImg = createElement('img', {
    'alt': '',
    'aria-hidden': 'true',
    'class': 'i-amphtml-intrinsic-sizer',
    'role': 'presentation',
    'src': `data:image/svg+xml;charset=utf-8,<svg height="${height.numeral}" width="${width.numeral}" xmlns="http://www.w3.org/2000/svg" version="1.1"/>`,
  });
  appendChild(sizer, sizerImg);
  return sizer;
}

module.exports = {
  applyLayout: function (customElement, log) {
    const ampLayout = parseLayout(customElement.attribs.layout);
    const widthAttribute = getAttributeOrNull(customElement, 'width');
    const inputWidth = cssLength(widthAttribute, /* allow_auto=*/ true, /* allow_fluid=*/ false);
    if (!inputWidth.isValid) {
      log.debug('cannot perform SSR: invalid input width\n', widthAttribute);
      return false;
    }
    const heightAttribute = getAttributeOrNull(customElement, 'height');
    const inputHeight = cssLength(
      heightAttribute,
      /* allow_auto=*/ true,
      /* allow_fluid=*/ ampLayout === 'fluid'
    );
    if (!inputHeight.isValid) {
      log.debug('cannot perform SSR: invalid input height\n', heightAttribute);
      return false;
    }

    // Calculate effective height, width and layout.
    const height = calculateHeight(ampLayout, inputHeight, customElement.tagName);
    const width = calculateWidth(ampLayout, inputWidth, customElement.tagName);

    const layout = calculateLayout(
      ampLayout,
      width,
      height,
      getAttributeOrNull(customElement, 'sizes'),
      getAttributeOrNull(customElement, 'heights')
    );

    if (!isSupportedLayout(layout)) {
      log.debug('cannot perform SSR: unsupported layout', layout);
      return false;
    }

    apply(layout, width, height, customElement);
    maybeAddSizerInto(customElement, layout, width, height);
    return true;
  },
};
