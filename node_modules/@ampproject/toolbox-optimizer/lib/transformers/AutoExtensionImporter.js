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

const {nextNode, insertAfter, createElement, firstChildByTag} = require('../NodeUtils');
const {findMetaViewport} = require('../HtmlDomHelper');
const {AMP_FORMATS, AMP_CACHE_HOST} = require('../AmpConstants');

const BIND_SHORT_FORM_PREFIX = 'bind';
const AMP_BIND_DATA_ATTRIBUTE_PREFIX = 'data-amp-bind-';
const DEFAULT_FORMAT = 'AMP';

// Some AMP component don't bring their own tag, but enable new attributes on other
// elements. Most are included in the AMP validation rules, but some are not. These
// need to be defined manually here.
const manualAttributeToExtensionMapping = new Map([
  ['mask', 'amp-inputmask'],
  ['lightbox', 'amp-lightbox-gallery'],
]);
const manualExtensions = Array.from(manualAttributeToExtensionMapping.values());

/**
 * Extension Auto Importer - this transformer auto imports all missing AMP extensions.
 *
 * The importer analyzes the HTML source code and identifies missing AMP extension imports
 * using multiple strategies:
 *
 * - use validation rules to map used AMP tags to required AMP extensions.
 * - use validation rules to map used AMP attributes to required AMP extensions.
 * - manually specifiy attribute to extension mappings if this information is not available in the
 *   validation rules.
 * - mnullay implement AMP extension detection for a few corner cases.
 *
 * This importer also enables a shortcode `bindtext` instead of `data-amp-bind-text` for specifying
 * AMP bindings when the square bracket notation (`[text]`) is not available. To avoid accidently
 * rewriting non-AMP attributes, the transformer uses the AMP validation rules to only rename bindable
 * attributes as specified in the validation rules.
 *
 * This transformer supports the following option:
 *
 * - `format: [AMP|AMP4EMAIL|AMP4ADS]` - specifies the AMP format. Defaults to `AMP`.
 * - `autoExtensionImport: [true|false]` - set to `false` to disable the auto extension import. Default to `true`.
 */
class AutoExtensionImporter {
  constructor(config) {
    this.enabled = config.autoExtensionImport !== false;
    this.format = config.format || DEFAULT_FORMAT;
    this.log_ = config.log.tag('AutoExtensionImporter');
    this.experimentBindAttributeEnabled = config.experimentBindAttribute === true;
    this.extensionVersions = config.extensionVersions || {};
  }

  /**
   * @private
   */
  createExtensionsSpec(params) {
    const rules = params.validatorRules;
    // Map extension names to info required for generating the extension imports
    const extensionsMap = new Map();
    for (const ext of rules.extensions) {
      if (ext.htmlFormat.includes(this.format)) {
        extensionsMap.set(ext.name, {
          name: ext.name,
          type: ext.extensionType === 'CUSTOM_TEMPLATE' ? 'custom-template' : 'custom-element',
          version: ext.version.filter((v) => v !== 'latest'),
        });
      }
    }
    // Maps tags (e.g. amp-state) to their extension (e.g. amp-bind)
    const tagToExtensionsMapping = new Map();
    // Maps tags to their extension specific allowed attributes
    // (e.g. amp-img => amp-fx => amp-fx-collection)
    const tagToAttributeMapping = new Map();
    // Maps tags to their bindable attributes (e.g. div => text)
    const tagToBindAttributeMapping = new Map();
    // Iterate over all available tags
    for (const tag of rules.getTagsForFormat(this.format)) {
      const tagName = tag.tagName.toLowerCase();
      // Map amp tags to their required extension(s)
      if (tagName.startsWith('amp-')) {
        // HACK: some tags define multiple validation rules for attribute based imports
        // e.g. amp-carousel, amp-carousel[lightbox]
        // these are handled differently, so we filter them out here
        let requiresExtension = tag.requiresExtension || [];
        requiresExtension = requiresExtension.filter((ext) => !manualExtensions.includes(ext));
        tagToExtensionsMapping.set(tagName, requiresExtension);
      }
      // Collects all bindable attributes
      const bindableAttributes = new Set();
      // Process the tag specific attributes
      for (const attribute of tag.attrs) {
        // Hack: fix missing attribute dependencies (e.g. amp-img => lightbox => amp-lightbox-gallery)
        if (manualAttributeToExtensionMapping.has(attribute.name)) {
          attribute.requiresExtension = [manualAttributeToExtensionMapping.get(attribute.name)];
        }
        // Map attributes to tags and extensions (e.g. amp-img => amp-fx => amp-fx-collection)
        if (attribute.requiresExtension && attribute.requiresExtension.length > 0) {
          const attributeMapping = tagToAttributeMapping.get(tagName) || [];
          attributeMapping.push(attribute);
          tagToAttributeMapping.set(tagName, attributeMapping);
        }
        // Maps tags to bindable attributes which are named `[text]`
        if (attribute.name.startsWith('[')) {
          bindableAttributes.add(attribute.name.substring(1, attribute.name.length - 1));
        }
      }
      tagToBindAttributeMapping.set(tagName, bindableAttributes);
    }
    return {
      extensionsMap,
      tagToExtensionsMapping,
      tagToAttributeMapping,
      tagToBindAttributeMapping,
    };
  }

  async transform(root, params) {
    if (!this.enabled) {
      return;
    }
    if (!params.validatorRules) {
      this.log_.error('Missing validation rules, cannot auto import extensions');
      return;
    }
    if (!this.extensionSpec_) {
      this.extensionSpec_ = this.createExtensionsSpec(params);
    }
    if (!AMP_FORMATS.includes(this.format)) {
      this.log_.error('Unsupported AMPHTML format', this.format);
      return;
    }
    const html = firstChildByTag(root, 'html');
    if (!html) return;
    const head = firstChildByTag(html, 'head');
    if (!head) return;
    const body = firstChildByTag(html, 'body');
    if (!body) return;

    // Extensions which need to be imported
    const extensionsToImport = new Set();
    // Keep track of existing extensions imports to avoid duplicates
    const existingImports = new Set();

    // Some AMP components need to be detected in the head (e.g. amp-access)
    this.findExistingExtensionsAndExtensionsToImportInHead_(
      head,
      extensionsToImport,
      existingImports
    );

    // Most AMP components can be detected in the body
    await this.findExtensionsToImportInBody_(body, extensionsToImport);

    if (extensionsToImport.length === 0) {
      // Nothing to do
      return;
    }

    // We use this for adding new import elements to the header
    const referenceNode = findMetaViewport(head);

    // Use cdn.ampproject.org as default, RewriteUrlTransformer will change this in case of self-hosting
    const host = AMP_CACHE_HOST;
    for (const extensionName of extensionsToImport) {
      if (existingImports.has(extensionName)) {
        continue;
      }
      const extension = this.extensionSpec_.extensionsMap.get(extensionName.trim());
      this.log_.debug('auto importing', extensionName);
      // Use the latest version by default
      let version = extension.version[extension.version.length - 1];
      // Let user override default
      if (this.extensionVersions[extensionName]) {
        version = this.extensionVersions[extensionName];
      }
      const extensionImportAttribs = {
        async: '',
        src: `${host}/v0/${extensionName}-${version}.js`,
      };
      extensionImportAttribs[extension.type] = extensionName;
      const extensionImport = createElement('script', extensionImportAttribs);
      insertAfter(head, extensionImport, referenceNode);
    }
  }

  /**
   * @private
   */
  findExistingExtensionsAndExtensionsToImportInHead_(head, extensionsToImport, existingImports) {
    let node = head;
    while (node) {
      // Detect any existing extension imports
      const customElement = this.getCustomElement_(node);
      if (customElement) {
        existingImports.add(customElement);
      }
      // Explicitly detect amp-access via the script tag in the header to be able to handle amp-access extensions
      else if (node.tagName === 'script' && node.attribs['id'] === 'amp-access') {
        extensionsToImport.add('amp-access');
        extensionsToImport.add('amp-analytics');
        const jsonData = this.getJson(node);
        if (jsonData.vendor === 'laterpay') {
          extensionsToImport.add('amp-access-laterpay');
        }
        // Explicitly detect amp-subscriptions via the script tag in the header to be able to handle amp-subscriptions extensions
      } else if (node.tagName === 'script' && node.attribs['id'] === 'amp-subscriptions') {
        extensionsToImport.add('amp-subscriptions');
        extensionsToImport.add('amp-analytics');
        const jsonData = this.getJson(node);
        if (jsonData.services && jsonData.services.length) {
          for (const service of jsonData.services) {
            if (service.serviceId === 'subscribe.google.com') {
              extensionsToImport.add('amp-subscriptions-google');
            }
          }
        }
      }
      node = nextNode(node);
    }
  }

  getJson(node) {
    for (const child of node.children || []) {
      if (!child.data) {
        continue;
      }
      try {
        return JSON.parse(child.data);
      } catch (error) {
        this.log_.error('Could not parse JSON in <script id="amp-access">', error.message);
      }
    }
    return {};
  }

  /**
   * @private
   */
  async findExtensionsToImportInBody_(body, extensionsToImport) {
    let node = body;
    while (node !== null) {
      if (node.tagName) {
        this.addRequiredExtensionByTag_(node, extensionsToImport);
        this.addRequiredExtensionByAttributes_(node, extensionsToImport);
      }
      node = nextNode(node);
    }
  }

  /**
   * @private
   */
  addRequiredExtensionByTag_(node, allRequiredExtensions) {
    // Check for required extensions by tag name
    const requiredExtensions = this.extensionSpec_.tagToExtensionsMapping.get(node.tagName);
    if (requiredExtensions) {
      requiredExtensions.forEach((ext) => allRequiredExtensions.add(ext));
    }
    // Add custom templates (e.g. amp-mustache)
    if (node.tagName === 'template' && node.attribs.type) {
      allRequiredExtensions.add(node.attribs.type);
    }
  }

  /**
   * @private
   */
  addRequiredExtensionByAttributes_(node, allRequiredExtensions) {
    if (!node.tagName || !node.attribs) {
      return;
    }
    // Look for element attributes indicating AMP components (e.g. amp-fx)
    const tagToAttributeMapping = this.extensionSpec_.tagToAttributeMapping;
    const attributesForTag = tagToAttributeMapping.get(node.tagName) || [];
    attributesForTag.forEach((attribute) => {
      if (node.attribs[attribute.name] !== undefined) {
        attribute.requiresExtension.forEach((ext) => {
          allRequiredExtensions.add(ext);
        });
      }
    });
    // Look for forms
    if (node.tagName === 'form') {
      allRequiredExtensions.add('amp-form');
    }
    // Check for amp-bind attribute bindings
    const tagToBindAttributeMapping = this.extensionSpec_.tagToBindAttributeMapping;
    const attributeNames = Object.keys(node.attribs);
    if (
      attributeNames.some((a) => a.startsWith('[') || a.startsWith(AMP_BIND_DATA_ATTRIBUTE_PREFIX))
    ) {
      allRequiredExtensions.add('amp-bind');
    }

    // EXPERIMENTAL FEATURE: Rewrite short-form `bindtext` to `data-amp-bind-text`
    // to avoid false-positives we check for each tag only the
    // supported bindable attributes (e.g. for a div only bindtext, but not bindvalue).
    if (this.experimentBindAttributeEnabled) {
      const ampBindAttrs = tagToBindAttributeMapping.get(node.tagName);
      // true if we need to import amp-bind
      let usesAmpBind = false;
      for (const attributeName of attributeNames) {
        if (!attributeName.startsWith(BIND_SHORT_FORM_PREFIX)) {
          continue;
        }
        const attributeNameWithoutBindPrefix = attributeName.substring(
          BIND_SHORT_FORM_PREFIX.length
        );

        // Rename attribute from bindx to data-amp-bind-x
        if (ampBindAttrs.has(attributeNameWithoutBindPrefix)) {
          const newAttributeName = `${AMP_BIND_DATA_ATTRIBUTE_PREFIX}${attributeNameWithoutBindPrefix}`;
          node.attribs[newAttributeName] = node.attribs[attributeName];
          delete node.attribs[attributeName];
          usesAmpBind = true;
        }
        if (usesAmpBind) {
          allRequiredExtensions.add('amp-bind');
        }
      }
    }
  }

  /**
   * @private
   */
  getCustomElement_(scriptNode) {
    if (scriptNode.tagName !== 'script') {
      return '';
    }
    const customElement =
      scriptNode.attribs['custom-element'] || scriptNode.attribs['custom-template'] || '';
    if (!customElement) {
      return '';
    }
    if (!customElement.startsWith('amp-')) {
      return '';
    }
    return customElement;
  }
}

module.exports = AutoExtensionImporter;
