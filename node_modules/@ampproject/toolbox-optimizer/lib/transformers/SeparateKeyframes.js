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

const {insertText, createElement, hasAttribute, firstChildByTag} = require('../NodeUtils');
const safeParser = require('postcss-safe-parser');
const postcss = require('postcss');

const cssnano = require('cssnano-simple');

const allowedKeyframeProps = new Set([
  'animation-timing-function',
  'offset-distance',
  'opacity',
  'visibility',
  'transform',
  '-webkit-transform',
  '-moz-transform',
  '-o-transform',
  '-ms-transform',
]);

/**
 * SeparateKeyframes - moves keyframes, media, and support from amp-custom
 * to amp-keyframes.
 *
 * This transformer supports the following options:
 *
 * - `minify [Boolean]`: compresses the CSS. The default is `true`.
 */
class SeparateKeyframes {
  constructor(config) {
    this.log_ = config.log.tag('SeparateKeyframes');
    this.minify = config.minify !== false;
  }

  async transform(tree) {
    const html = firstChildByTag(tree, 'html');
    if (!html) return;
    const head = firstChildByTag(html, 'head');
    if (!head) return;
    const body = firstChildByTag(html, 'body') || head;
    if (this.isAmpStory(body)) {
      return;
    }
    let stylesCustomTag;
    let stylesKeyframesTag;

    // Get style[amp-custom] and remove style[amp-keyframes]
    head.children = head.children.filter((tag) => {
      if (tag.tagName !== 'style') return true;

      if (!stylesKeyframesTag && hasAttribute(tag, 'amp-keyframes')) {
        stylesKeyframesTag = tag;
        return false;
      }
      if (!stylesCustomTag && hasAttribute(tag, 'amp-custom')) {
        stylesCustomTag = tag;
      }
      return true;
    });

    const extraPlugins = this.minify ? [cssnano] : [];

    // If no custom styles, there's nothing to do
    if (!stylesCustomTag) return;
    let stylesText = stylesCustomTag.children[0];

    if (!stylesText || !stylesText.data) return;
    stylesText = stylesText.data;

    // initialize an empty keyframes tree
    const keyframesTree = postcss.parse('');

    const isInvalidKeyframe = (keyframe) => {
      let invalidProperty;
      for (const frame of keyframe.nodes) {
        for (const declaration of frame.nodes) {
          if (!allowedKeyframeProps.has(declaration.prop)) {
            invalidProperty = declaration.prop;
            break;
          }
        }
        if (invalidProperty) break;
      }
      return invalidProperty;
    };

    const keyframesPlugin = postcss.plugin('postcss-amp-keyframes-mover', () => {
      return (root) => {
        root.nodes = root.nodes.filter((rule) => {
          if (rule.name === 'keyframes') {
            // We can't move a keyframe with an invalid property
            // or else the style[amp-keyframes] is invalid
            const invalidProperty = isInvalidKeyframe(rule);
            if (invalidProperty) {
              this.logInvalid(rule.name, invalidProperty);
              return true;
            }
            keyframesTree.nodes.push(rule);
            return false;
          }
          // if rule has any keyframes duplicate rule and move just
          // the keyframes
          if (rule.name === 'media' || rule.name === 'supports') {
            const copiedRule = Object.assign({}, rule, {nodes: []});
            rule.nodes = rule.nodes.filter((rule) => {
              if (rule.name !== 'keyframes') return true;
              const invalidProperty = isInvalidKeyframe(rule);
              if (invalidProperty) {
                this.logInvalid(rule.name, invalidProperty);
                return true;
              }
              copiedRule.nodes.push(rule);
            });
            if (copiedRule.nodes.length) {
              keyframesTree.nodes.push(copiedRule);
            }
            // if no remaining rules remove it
            return rule.nodes.length;
          }
          return true;
        });
      };
    });

    const {css: cssResult} = await postcss([...extraPlugins, keyframesPlugin])
      .process(stylesText, {
        from: undefined,
        parser: safeParser,
      })
      .catch((err) => {
        this.log_.warn(`Failed to process CSS`, err.message);
        return {css: stylesText};
      });

    // if no rules moved nothing to do
    if (keyframesTree.nodes.length === 0) {
      // re-serialize to compress the CSS
      stylesCustomTag.children[0].data = cssResult;
      return;
    }

    if (!stylesKeyframesTag) {
      // Check body for keyframes tag, removing it if found
      body.children = body.children.filter((tag) => {
        if (tag.tagName === 'style' && hasAttribute(tag, 'amp-keyframes')) {
          stylesKeyframesTag = tag;
          return false;
        }
        return true;
      });

      if (!stylesKeyframesTag) {
        stylesKeyframesTag = createElement('style', {'amp-keyframes': ''});
      }
    }
    // Insert keyframes styles to Node
    const keyframesTextNode = stylesKeyframesTag.children[0];
    const currentKeyframesTree = postcss.parse((keyframesTextNode && keyframesTextNode.data) || '');
    currentKeyframesTree.nodes = keyframesTree.nodes.concat(currentKeyframesTree.nodes);

    let keyframesText = '';
    postcss.stringify(currentKeyframesTree, (part) => {
      keyframesText += part;
    });

    // if we have extra plugins make sure process the keyframes CSS with them
    if (extraPlugins.length > 0) {
      const cssResult = await postcss(extraPlugins).process(keyframesText, {
        from: undefined,
        parser: safeParser,
      });
      keyframesText = cssResult.css;
    }

    if (!keyframesTextNode) {
      insertText(stylesKeyframesTag, keyframesText);
    } else {
      keyframesTextNode.data = keyframesText;
    }

    // Add keyframes tag to end of body
    body.children.push(stylesKeyframesTag);
    // Update stylesCustomTag with filtered styles
    stylesCustomTag.children[0].data = cssResult;
  }
  logInvalid(name, property) {
    this.log_.warn(
      `Found invalid keyframe property '${property}' in '${name}' not moving to style[amp-keyframes]`
    );
  }

  isAmpStory(body) {
    return body.children.some((child) => child.tagName === 'amp-story');
  }
}

module.exports = SeparateKeyframes;
