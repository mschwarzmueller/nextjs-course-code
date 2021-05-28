/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

class AmpValidatorRules {
  /**
   * Creates an instance of AmpValidatorRules.
   * @param {Object} rules - rules imported from validator.json
   */
  constructor(rules) {
    /**
     * Unprocessed validator rules.
     * @type {Object}
     */
    this.raw = rules;
    /**
     * List of all the tags processed from rules.
     * @type {Array<Object>}
     */
    this.tags = [];
    /**
     * List of all the extensions processed from rules.
     * @type {Array<Object>}
     */
    this.extensions = [];
    /**
     * Map of errors and their associated format and specificity.
     * @type {Object}
     */
    this.errors = {};

    this.extensionCache_ = {};
    this.initRules_(rules);
  }

  /**
   * Returns the list of supported tags for the given format.
   *
   * @param {string} format - Format to return tags for
   * @param {boolean} [transformed] - Use transformed version of the format
   * @return {Array<Object>} List of tags supported by the given format
   */
  getTagsForFormat(format, transformed = false) {
    format = format.toLowerCase();
    return this.tags
      .filter(
        (tag) =>
          tag.htmlFormat.includes(format.toUpperCase()) &&
          this.checkEntityFormat_(tag, format) &&
          this.checkEntityTransformed_(tag, transformed)
      )
      .map((tag) => {
        tag = Object.assign({}, tag);
        tag.attrs = tag.attrs.filter(
          (attr) =>
            this.checkEntityFormat_(attr, format) && this.checkEntityTransformed_(attr, transformed)
        );
        return tag;
      });
  }

  /**
   * Returns the AMP extension spec for the given format and name.
   *
   * @param {string} format - Format to filter on
   * @param {string} extension - Extension name
   * @return {Object} Extension spec
   */
  getExtension(format, extension) {
    format = format.toLowerCase();
    extension = extension.toLowerCase();
    const key = `${format}|${extension}`;
    return this.extensionCache_[key] || null;
  }

  checkEntityTransformed_(entity, transformed) {
    const isEnabled = this.isEnabled_(entity, 'transformed');
    const isDisabled = this.isDisabled_(entity, 'transformed');
    if (transformed) {
      return isEnabled !== false && isDisabled !== true;
    }
    return isEnabled !== true && isDisabled !== false;
  }

  checkEntityFormat_(entity, format) {
    format = format.toLowerCase();
    const isEnabled = this.isEnabled_(entity, format);
    const isDisabled = this.isDisabled_(entity, format);
    return isEnabled !== false && isDisabled !== true;
  }

  isEnabled_(entity, format) {
    if (!entity.enabledBy) {
      return null;
    }
    return entity.enabledBy.includes(format);
  }

  isDisabled_(entity, format) {
    if (!entity.disabledBy) {
      return null;
    }
    return entity.disabledBy.includes(format);
  }

  initRules_(rules) {
    this.initErrors_(rules);
    this.initAttrLists_(rules);
    this.initTags_(rules);
    this.initExtensions_(rules);
  }

  initErrors_(rules) {
    this.errors = {};
    for (const errorFormat of rules.errorFormats) {
      const error = this.errors[errorFormat.code] || {};
      error.format = errorFormat.format;
      this.errors[errorFormat.code] = error;
    }
    for (const errorSpecificity of rules.errorSpecificity) {
      const error = this.errors[errorSpecificity.code] || {};
      error.specificity = errorSpecificity.specificity;
      this.errors[errorSpecificity.code] = error;
    }
  }

  initAttrLists_(rules) {
    this.attrLists_ = {};
    this.specialAttrLists_ = {};
    for (const {name, attrs} of rules.attrLists) {
      if (name.startsWith('$')) {
        this.specialAttrLists_[name] = attrs;
      } else {
        this.attrLists_[name] = attrs;
      }
    }
    this.specialAttrLists_.$AMP_LAYOUT_ATTRS.forEach((attr) => (attr.layout = true));
    this.specialAttrLists_.$GLOBAL_ATTRS.forEach((attr) => (attr.global = true));
  }

  initTags_(rules) {
    this.tags = rules.tags
      .filter((tag) => !tag.extensionSpec)
      .map((tag) => {
        tag.attrs = tag.attrs || [];

        // `attrLists` contains list IDs that are looked up from the global
        // attribute lists and merged into `attrs`.
        if (tag.attrLists) {
          for (const attrList of tag.attrLists) {
            tag.attrs.push(...this.attrLists_[attrList]);
          }
          delete tag.attrLists;
        }

        // $AMP_LAYOUT_ATTRS are present in all components with ampLayout
        if (tag.ampLayout) {
          tag.attrs.push(...this.specialAttrLists_.$AMP_LAYOUT_ATTRS);
        }

        // $GLOBAL_ATTRS are present in all components
        tag.attrs.push(...this.specialAttrLists_.$GLOBAL_ATTRS);

        return tag;
      });
  }

  initExtensions_(rules) {
    this.extensions = rules.tags
      .filter((tag) => tag.extensionSpec)
      .map((tag) => Object.assign({}, tag.extensionSpec, {htmlFormat: tag.htmlFormat}));

    for (const extension of this.extensions) {
      const name = extension.name.toLowerCase();
      for (let format of extension.htmlFormat) {
        format = format.toLowerCase();
        const key = `${format}|${name}`;
        this.extensionCache_[key] = extension;
      }
    }
  }
}

module.exports = AmpValidatorRules;
