'use strict';
const camelCase = require('lodash.camelcase');
const React = require('react');
const camelCaseAttrMap = require('./camel-case-attribute-names');

function createStyleJsonFromString(styleString) {
  styleString = styleString || '';
  const styles = styleString.split(/;(?!base64)/);
  let singleStyle, key, value, jsonStyles = {};
  for (let i = 0; i < styles.length; ++i) {
    singleStyle = styles[i].split(':');
    if (singleStyle.length > 2) {
      singleStyle[1] = singleStyle.slice(1).join(':');
    }

    key = singleStyle[0];
    value = singleStyle[1];
    if (typeof value === 'string') {
      value = value.trim();
    }

    if (key != null && value != null && key.length > 0 && value.length > 0) {
      key = key.trim();

      // Don't camelCase CSS custom properties
      if (key.indexOf('--') !== 0) {
        key = camelCase(key);
      }

      jsonStyles[key] = value;
    }
  }
  return jsonStyles;
}

// Boolean HTML attributes, copied from https://meiert.com/en/blog/boolean-attributes-of-html/,
// on the form React expects.
const booleanAttrs = [
  'allowFullScreen',
  'allowpaymentrequest',
  'async',
  'autoFocus',
  'autoPlay',
  'checked',
  'controls',
  'default',
  'disabled',
  'formNoValidate',
  'hidden',
  'ismap',
  'itemScope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'noValidate',
  'open',
  'playsinline',
  'readOnly',
  'required',
  'reversed',
  'selected',
  'truespeed',
];

function createElement(node, index, data, children) {
  let elementProps = {
    key: index,
  };
  // The Custom Elements specification explicitly states that;
  // custom element names must contain a hyphen.
  // src: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
  const isCustomElementNode = node.name.includes('-');

  if (node.attribs) {
    elementProps = Object.entries(node.attribs).reduce((result, [key, value,]) => {
      // if it's a custom element, we leave its attributes as is
      if (!isCustomElementNode) {
        key = camelCaseAttrMap[key.replace(/[-:]/, '')] || key;
        if (key === 'style') {
          value = createStyleJsonFromString(value);
        } else if (key === 'class') {
          key = 'className';
        } else if (key === 'for') {
          key = 'htmlFor';
        } else if (key.startsWith('on')) {
          value = Function(value);
        }

        if (booleanAttrs.includes(key) && (value || '') === '') {
          value = key;
        }
      }

      result[key] = value;
      return result;
    }, elementProps);
  }

  children = children || [];
  const allChildren = data != null ? [data,].concat(children) : children;
  return React.createElement.apply(
    null, [node.name, elementProps,].concat(allChildren)
  );
}

module.exports = {
  createElement,
};
