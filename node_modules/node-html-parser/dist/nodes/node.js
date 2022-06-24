"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Node Class as base class for TextNode and HTMLElement.
 */
var Node = /** @class */ (function () {
    function Node() {
        this.childNodes = [];
    }
    Object.defineProperty(Node.prototype, "innerText", {
        get: function () {
            return this.rawText;
        },
        enumerable: false,
        configurable: true
    });
    return Node;
}());
exports.default = Node;
