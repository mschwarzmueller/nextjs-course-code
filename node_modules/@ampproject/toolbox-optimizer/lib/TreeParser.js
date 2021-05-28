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

const {Parser} = require('htmlparser2');
const {DomHandler, NodeWithChildren} = require('domhandler');
const {appendAll} = require('./NodeUtils');
const render = require('dom-serializer').default;

const PARSER_OPTIONS = {
  decodeEntities: false,
};

/**
 * HTML parser and serializer. DOM nodes use htmlparser2 API with custom extensions
 * required by transformers.
 */
class TreeParser {
  constructor(options) {
    this.options = options;
  }

  /**
   * Parses an HTML string.
   *
   * @param {string} html
   * @returns {Node} root node
   */
  parse(html) {
    return new Promise((resolve, reject) => {
      const handler = new DomHandler((error, dom) => {
        if (error) {
          reject(error);
        } else {
          const root = new NodeWithChildren('root', []);
          appendAll(root, dom);
          resolve(root);
        }
      }, this.options);
      const parser = new Parser(handler, this.options);
      parser.write(html.trim());
      parser.end();
    });
  }

  /**
   * Serializes a tree to an HTML string.
   *
   * @param {Tree} tree
   */
  serialize(node) {
    return render(node, {});
  }
}

module.exports = new TreeParser(PARSER_OPTIONS);
module.exports.TreeParser = TreeParser;
