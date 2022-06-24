"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeType = exports.TextNode = exports.Node = exports.default = exports.parse = exports.HTMLElement = exports.CommentNode = void 0;
var comment_1 = require("./nodes/comment");
Object.defineProperty(exports, "CommentNode", { enumerable: true, get: function () { return __importDefault(comment_1).default; } });
var html_1 = require("./nodes/html");
Object.defineProperty(exports, "HTMLElement", { enumerable: true, get: function () { return __importDefault(html_1).default; } });
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return html_1.parse; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return html_1.parse; } });
var node_1 = require("./nodes/node");
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return __importDefault(node_1).default; } });
var text_1 = require("./nodes/text");
Object.defineProperty(exports, "TextNode", { enumerable: true, get: function () { return __importDefault(text_1).default; } });
var type_1 = require("./nodes/type");
Object.defineProperty(exports, "NodeType", { enumerable: true, get: function () { return __importDefault(type_1).default; } });
