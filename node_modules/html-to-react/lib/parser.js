'use strict';
const HtmlParser = require('htmlparser2').Parser;
const DomHandler = require('domhandler').DomHandler;
const ProcessingInstructions = require('./processing-instructions');
const IsValidNodeDefinitions = require('./is-valid-node-definitions');
const utils = require('./utils');

function Html2ReactParser(options) {
  function parseHtmlToTree(html) {
    options = options || {};
    options.decodeEntities = true;
    const handler = new DomHandler();
    const parser = new HtmlParser(handler, options);
    parser.parseComplete(html);
    return handler.dom.filter(function (element) {
      return element.type !== 'directive';
    });
  };

  function traverseDom(node, isValidNode, processingInstructions, preprocessingInstructions,
    index) {
    if (isValidNode(node)) {
      (preprocessingInstructions || []).forEach((instruction) => {
        if (instruction.shouldPreprocessNode(node)) {
          instruction.preprocessNode(node, index);
        }
      });

      const processingInstruction = (processingInstructions || []).find((instruction) => {
        return instruction.shouldProcessNode(node);
      });
      if (processingInstruction != null) {
        const children = (node.children || []).map((child, i) => {
          return traverseDom(child, isValidNode, processingInstructions,
            preprocessingInstructions, i);
        }).filter((child) => {
          return child != null && child !== false;
        });

        if (processingInstruction.replaceChildren) {
          return utils.createElement(node, index, node.data, [
            processingInstruction.processNode(node, children, index),
          ]);
        } else {
          return processingInstruction.processNode(node, children, index);
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  function parseWithInstructions(html, isValidNode, processingInstructions,
      preprocessingInstructions) {
    const domTree = parseHtmlToTree(html);
    const list = domTree.map(function (domTreeItem, index) {
      return traverseDom(domTreeItem, isValidNode, processingInstructions,
        preprocessingInstructions, index);
    });
    return list.length <= 1 ? list[0] : list;
  };

  function parse(html) {
    const processingInstructions = new ProcessingInstructions();
    return parseWithInstructions(html,
      IsValidNodeDefinitions.alwaysValid,
      processingInstructions.defaultProcessingInstructions);
  };

  return {
    parse: parse,
    parseWithInstructions: parseWithInstructions,
  };
};

module.exports = Html2ReactParser;
