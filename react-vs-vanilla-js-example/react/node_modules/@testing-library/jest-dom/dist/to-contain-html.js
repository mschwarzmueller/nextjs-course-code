"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toContainHTML = toContainHTML;

var _utils = require("./utils");

function toContainHTML(container, htmlText) {
  (0, _utils.checkHtmlElement)(container, toContainHTML, this);
  return {
    pass: container.outerHTML.includes(htmlText),
    message: () => {
      return [this.utils.matcherHint(`${this.isNot ? '.not' : ''}.toContainHTML`, 'element', ''), 'Expected:', // eslint-disable-next-line babel/new-cap
      `  ${this.utils.EXPECTED_COLOR(htmlText)}`, 'Received:', `  ${this.utils.printReceived(container.cloneNode(true))}`].join('\n');
    }
  };
}