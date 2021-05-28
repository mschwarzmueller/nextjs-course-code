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

const VALID_UNITS = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax'];
const AMP_LAYOUTS = [
  'nodisplay',
  'fixed',
  'responsive',
  'fixed-height',
  'fill',
  'container',
  'flex-item',
  'fluid',
  'intrinsic',
];
const SIZE_DEFINED_LAYOUTS = [
  'fixed',
  'fixed-height',
  'responsive',
  'fill',
  'flex-item',
  'intrinsic',
];
const CSS_LENGTH_ONE_PX = cssLength('1', false, false);
const CSS_LENGTH_AUTO = cssLength('auto', true, false);
const CSS_LENGTH_FOURTY_FOUR_PX = cssLength('44px', false, false);
const CSS_LENGTH_SIXTY_PX = cssLength('60px', false, false);

function getLayoutClass(layout) {
  if (!layout) {
    return layout;
  }
  return 'i-amphtml-layout-' + layout;
}

function calculateHeight(inputLayout, inputHeight, tagName) {
  if (
    (inputLayout === '' || inputLayout === 'fixed' || inputLayout === 'fixed-height') &&
    !inputHeight.isSet
  ) {
    // These values come from AMP's runtime and can be found in
    // https://github.com/ampproject/amphtml/blob/master/src/layout.js#L70
    switch (tagName) {
      case 'amp-analytics':
        return CSS_LENGTH_ONE_PX;
      case 'amp-audio':
        return CSS_LENGTH_AUTO;
      case 'amp-pixel':
        return CSS_LENGTH_ONE_PX;
      case 'amp-social-share':
        return CSS_LENGTH_FOURTY_FOUR_PX;
      default:
    }
  }
  return inputHeight;
}

function calculateWidth(inputLayout, inputWidth, tagname) {
  if ((inputLayout === '' || inputLayout === 'fixed') && !inputWidth.isSet) {
    // These values come from AMP's runtime and can be found in
    // https://github.com/ampproject/amphtml/blob/master/src/layout.js#L70
    switch (tagname) {
      case 'amp-analytics':
        return CSS_LENGTH_ONE_PX;
      case 'amp-audio':
        return CSS_LENGTH_AUTO;
      case 'amp-pixel':
        return CSS_LENGTH_ONE_PX;
      case 'amp-social-share':
        return CSS_LENGTH_SIXTY_PX;
      default:
    }
  }
  return inputWidth;
}

function isLayoutSizeDefined(layout) {
  return SIZE_DEFINED_LAYOUTS.indexOf(layout) > -1;
}

function getCssLengthStyle(cssLength, type) {
  if (!cssLength.isSet) {
    return '';
  }
  if (cssLength.isAuto) {
    return `${type}:auto;`;
  }
  return `${type}:${cssLength.numeral}${cssLength.unit};`;
}

function parseLayout(layout) {
  if (!layout) {
    return '';
  }
  layout = layout.toLowerCase();
  if (AMP_LAYOUTS.indexOf(layout) > -1) {
    return layout;
  }
  return ''; // unknown layout
}

function calculateLayout(inputLayout, width, height, sizesAttr, heightsAttr) {
  if (inputLayout !== '') {
    return inputLayout;
  }

  if (!width.isSet && !height.isSet) {
    return 'container';
  }

  if (height.isSet && (!width.isSet || width.isAuto)) {
    return 'fixed-height';
  }

  if (height.isSet && width.isSet && (sizesAttr || heightsAttr)) {
    return 'responsive';
  }

  return 'fixed';
}

function cssLength(input, allowAuto = false, allowFluid = false) {
  const result = {
    isValid: false,
    isSet: false,
    isAuto: false,
    isFluid: false,
    numeral: Number.NaN,
    unit: 'px',
  };

  if (input === null) {
    result.isValid = true;
    return result;
  }

  result.isSet = true;

  if (input === 'auto') {
    result.isAuto = true;
    result.isValid = allowAuto;
    return result;
  }

  if (input === 'fluid') {
    result.isFluid = true;
    result.isValid = allowFluid;
    return result;
  }

  const leadingNumber = /(\d+(?:\.\d+)?)(.*)/;
  const match = leadingNumber.exec(input);
  if (!match) {
    return result;
  }
  result.numeral = Number.parseFloat(match[1]);
  input = match[2];
  if (input === '') {
    result.unit = 'px';
    result.isValid = true;
    return result;
  }

  if (VALID_UNITS.indexOf(input) > -1) {
    result.isValid = true;
    result.unit = input;
  }
  return result;
}

function getLayoutSizeDefinedClass() {
  return 'i-amphtml-layout-size-defined';
}

module.exports = {
  parseLayout: parseLayout,
  cssLength: cssLength,
  getLayoutClass: getLayoutClass,
  calculateHeight: calculateHeight,
  calculateWidth: calculateWidth,
  isLayoutSizeDefined: isLayoutSizeDefined,
  getCssLengthStyle: getCssLengthStyle,
  calculateLayout: calculateLayout,
  getLayoutSizeDefinedClass: getLayoutSizeDefinedClass,
};
