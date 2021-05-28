var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define("back", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function arr_back(arr) {
        return arr[arr.length - 1];
    }
    exports.default = arr_back;
});
define("nodes/type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NodeType;
    (function (NodeType) {
        NodeType[NodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
        NodeType[NodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
        NodeType[NodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    })(NodeType || (NodeType = {}));
    exports.default = NodeType;
});
define("nodes/node", ["require", "exports"], function (require, exports) {
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
});
define("nodes/comment", ["require", "exports", "nodes/node", "nodes/type"], function (require, exports, node_1, type_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    node_1 = __importDefault(node_1);
    type_1 = __importDefault(type_1);
    var CommentNode = /** @class */ (function (_super) {
        __extends(CommentNode, _super);
        function CommentNode(rawText) {
            var _this = _super.call(this) || this;
            _this.rawText = rawText;
            /**
             * Node Type declaration.
             * @type {Number}
             */
            _this.nodeType = type_1.default.COMMENT_NODE;
            return _this;
        }
        Object.defineProperty(CommentNode.prototype, "text", {
            /**
             * Get unescaped text value of current node and its children.
             * @return {string} text content
             */
            get: function () {
                return this.rawText;
            },
            enumerable: false,
            configurable: true
        });
        CommentNode.prototype.toString = function () {
            return "<!--" + this.rawText + "-->";
        };
        return CommentNode;
    }(node_1.default));
    exports.default = CommentNode;
});
define("nodes/text", ["require", "exports", "nodes/type", "nodes/node"], function (require, exports, type_2, node_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    type_2 = __importDefault(type_2);
    node_2 = __importDefault(node_2);
    /**
     * TextNode to contain a text element in DOM tree.
     * @param {string} value [description]
     */
    var TextNode = /** @class */ (function (_super) {
        __extends(TextNode, _super);
        function TextNode(rawText) {
            var _this = _super.call(this) || this;
            _this.rawText = rawText;
            /**
             * Node Type declaration.
             * @type {Number}
             */
            _this.nodeType = type_2.default.TEXT_NODE;
            return _this;
        }
        Object.defineProperty(TextNode.prototype, "text", {
            /**
             * Get unescaped text value of current node and its children.
             * @return {string} text content
             */
            get: function () {
                return this.rawText;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextNode.prototype, "isWhitespace", {
            /**
             * Detect if the node contains only white space.
             * @return {bool}
             */
            get: function () {
                return /^(\s|&nbsp;)*$/.test(this.rawText);
            },
            enumerable: false,
            configurable: true
        });
        TextNode.prototype.toString = function () {
            return this.text;
        };
        return TextNode;
    }(node_2.default));
    exports.default = TextNode;
});
define("matcher", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Cache to store generated match functions
     * @type {Object}
     */
    var pMatchFunctionCache = {};
    function compare_tagname(tag1, tag2) {
        if (!tag1) {
            return !tag2;
        }
        if (!tag2) {
            return !tag1;
        }
        return tag1.toLowerCase() === tag2.toLowerCase();
    }
    /**
     * Function cache
     */
    var functionCache = {
        f145: function (el, tagName, classes) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            if (el.id !== tagName.substr(1)) {
                return false;
            }
            for (var cls = classes, i = 0; i < cls.length; i++) {
                if (el.classNames.indexOf(cls[i]) === -1) {
                    return false;
                }
            }
            return true;
        },
        f45: function (el, tagName, classes) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            for (var cls = classes, i = 0; i < cls.length; i++) {
                if (el.classNames.indexOf(cls[i]) === -1) {
                    return false;
                }
            }
            return true;
        },
        f15: function (el, tagName) {
            'use strict';
            tagName = tagName || '';
            if (el.id !== tagName.substr(1)) {
                return false;
            }
            return true;
        },
        f1: function (el, tagName) {
            'use strict';
            tagName = tagName || '';
            if (el.id !== tagName.substr(1)) {
                return false;
            }
        },
        f5: function () {
            'use strict';
            return true;
        },
        f55: function (el, tagName, classes, attr_key) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            attr_key = attr_key || '';
            var attrs = el.attributes;
            return attrs.hasOwnProperty(attr_key);
        },
        f245: function (el, tagName, classes, attr_key, value) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            attr_key = (attr_key || '').toLowerCase();
            value = value || '';
            var attrs = el.attributes;
            return Object.keys(attrs).some(function (key) {
                var val = attrs[key];
                return key.toLowerCase() === attr_key && val === value;
            });
            // for (let cls = classes, i = 0; i < cls.length; i++) {if (el.classNames.indexOf(cls[i]) === -1){ return false;}}
            // return true;
        },
        f25: function (el, tagName, classes, attr_key, value) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            attr_key = (attr_key || '').toLowerCase();
            value = value || '';
            var attrs = el.attributes;
            return Object.keys(attrs).some(function (key) {
                var val = attrs[key];
                return key.toLowerCase() === attr_key && val === value;
            });
            // return true;
        },
        f2: function (el, tagName, classes, attr_key, value) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            attr_key = (attr_key || '').toLowerCase();
            value = value || '';
            var attrs = el.attributes;
            return Object.keys(attrs).some(function (key) {
                var val = attrs[key];
                return key.toLowerCase() === attr_key && val === value;
            });
        },
        f345: function (el, tagName, classes) {
            'use strict';
            tagName = tagName || '';
            classes = classes || [];
            if (!compare_tagname(el.tagName, tagName)) {
                return false;
            }
            for (var cls = classes, i = 0; i < cls.length; i++) {
                if (el.classNames.indexOf(cls[i]) === -1) {
                    return false;
                }
            }
            return true;
        },
        f35: function (el, tagName) {
            'use strict';
            tagName = tagName || '';
            return compare_tagname(el.tagName, tagName);
        },
        f3: function (el, tagName) {
            'use strict';
            tagName = tagName || '';
            // if (el.tagName !== tagName) {
            // 	return false;
            // }
            return compare_tagname(el.tagName, tagName);
        }
    };
    /**
     * Matcher class to make CSS match
     *
     * @class Matcher
     */
    var Matcher = /** @class */ (function () {
        /**
         * Creates an instance of Matcher.
         * @param {string} selector
         *
         * @memberof Matcher
         */
        function Matcher(selector) {
            this.nextMatch = 0;
            this.matchers = selector.split(' ').map(function (matcher) {
                if (pMatchFunctionCache[matcher]) {
                    return pMatchFunctionCache[matcher];
                }
                var parts = matcher.split('.');
                var tagName = parts[0];
                var classes = parts.slice(1).sort();
                // let source = '"use strict";';
                var function_name = 'f';
                var attr_key = '';
                var value = '';
                if (tagName && tagName !== '*') {
                    if (tagName.startsWith('#')) {
                        // source += 'if (el.id != ' + JSON.stringify(tagName.substr(1)) + ') return false;';// 1
                        function_name += '1';
                    }
                    else {
                        // https://github.com/taoqf/node-html-parser/issues/86
                        // const reg = /\[\s*([\w-]+)(\s*=\s*(((?<quote>'|")\s*(.*)(\k<quote>))|(\S*)))?\s*\]/.exec(tagName);
                        // `[a-b]`,`[ a-b ]`,`[a-b=c]`, `[a-b=c'd]`,`[a-b='c\' d"e ']`,`[ a-b = 'c\' d"e ' ]`,`[a-b="c' d\"e " ]`,`[ a-b = "c' d\"e " ]`
                        var reg = /\[\s*([\w-]+)(\s*=\s*(('\s*(.*)'|"\s*(.*)")|(\S*)))?\s*\]/.exec(tagName);
                        if (reg) {
                            attr_key = reg[1];
                            value = reg[5] || reg[6] || reg[7];
                            // source += `let attrs = el.attributes;for (let key in attrs){const val = attrs[key]; if (key == "${attr_key}" && val == "${value}"){return true;}} return false;`;// 2
                            function_name += '2';
                        }
                        else {
                            // source += 'if (el.tagName != ' + JSON.stringify(tagName) + ') return false;';// 3
                            function_name += '3';
                        }
                    }
                }
                if (classes.length > 0) {
                    // source += 'for (let cls = ' + JSON.stringify(classes) + ', i = 0; i < cls.length; i++) if (el.classNames.indexOf(cls[i]) === -1) return false;';// 4
                    function_name += '4';
                }
                // source += 'return true;';// 5
                function_name += '5';
                var obj = {
                    func: functionCache[function_name],
                    tagName: tagName || '',
                    classes: classes || '',
                    attr_key: attr_key || '',
                    value: value || ''
                };
                // source = source || '';
                return (pMatchFunctionCache[matcher] = obj);
            });
        }
        /**
         * Trying to advance match pointer
         * @param  {HTMLElement} el element to make the match
         * @return {bool}           true when pointer advanced.
         */
        Matcher.prototype.advance = function (el) {
            if (this.nextMatch < this.matchers.length &&
                this.matchers[this.nextMatch].func(el, this.matchers[this.nextMatch].tagName, this.matchers[this.nextMatch].classes, this.matchers[this.nextMatch].attr_key, this.matchers[this.nextMatch].value)) {
                this.nextMatch++;
                return true;
            }
            return false;
        };
        /**
         * Rewind the match pointer
         */
        Matcher.prototype.rewind = function () {
            this.nextMatch--;
        };
        Object.defineProperty(Matcher.prototype, "matched", {
            /**
             * Trying to determine if match made.
             * @return {bool} true when the match is made
             */
            get: function () {
                return this.nextMatch === this.matchers.length;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Rest match pointer.
         * @return {[type]} [description]
         */
        Matcher.prototype.reset = function () {
            this.nextMatch = 0;
        };
        /**
         * flush cache to free memory
         */
        Matcher.prototype.flushCache = function () {
            pMatchFunctionCache = {};
        };
        return Matcher;
    }());
    exports.default = Matcher;
});
define("nodes/html", ["require", "exports", "he", "nodes/node", "nodes/type", "nodes/text", "matcher", "back", "nodes/comment"], function (require, exports, he_1, node_3, type_3, text_1, matcher_1, back_1, comment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = void 0;
    node_3 = __importDefault(node_3);
    type_3 = __importDefault(type_3);
    text_1 = __importDefault(text_1);
    matcher_1 = __importDefault(matcher_1);
    back_1 = __importDefault(back_1);
    comment_1 = __importDefault(comment_1);
    var kBlockElements = new Map();
    kBlockElements.set('DIV', true);
    kBlockElements.set('div', true);
    kBlockElements.set('P', true);
    kBlockElements.set('p', true);
    // ul: true,
    // ol: true,
    kBlockElements.set('LI', true);
    kBlockElements.set('li', true);
    // table: true,
    // tr: true,
    kBlockElements.set('TD', true);
    kBlockElements.set('td', true);
    kBlockElements.set('SECTION', true);
    kBlockElements.set('section', true);
    kBlockElements.set('BR', true);
    kBlockElements.set('br', true);
    /**
     * HTMLElement, which contains a set of children.
     *
     * Note: this is a minimalist implementation, no complete tree
     *   structure provided (no parentNode, nextSibling,
     *   previousSibling etc).
     * @class HTMLElement
     * @extends {Node}
     */
    var HTMLElement = /** @class */ (function (_super) {
        __extends(HTMLElement, _super);
        /**
         * Creates an instance of HTMLElement.
         * @param keyAttrs	id and class attribute
         * @param [rawAttrs]	attributes in string
         *
         * @memberof HTMLElement
         */
        function HTMLElement(tagName, keyAttrs, rawAttrs, parentNode) {
            if (rawAttrs === void 0) { rawAttrs = ''; }
            if (parentNode === void 0) { parentNode = null; }
            var _this = _super.call(this) || this;
            _this.rawAttrs = rawAttrs;
            _this.parentNode = parentNode;
            _this.classNames = [];
            /**
             * Node Type declaration.
             */
            _this.nodeType = type_3.default.ELEMENT_NODE;
            _this.rawTagName = tagName;
            _this.rawAttrs = rawAttrs || '';
            _this.parentNode = parentNode || null;
            _this.childNodes = [];
            if (keyAttrs.id) {
                _this.id = keyAttrs.id;
                if (!rawAttrs) {
                    _this.rawAttrs = "id=\"" + keyAttrs.id + "\"";
                }
            }
            if (keyAttrs.class) {
                _this.classNames = keyAttrs.class.split(/\s+/);
                if (!rawAttrs) {
                    var cls = "class=\"" + _this.classNames.join(' ') + "\"";
                    if (_this.rawAttrs) {
                        _this.rawAttrs += " " + cls;
                    }
                    else {
                        _this.rawAttrs = cls;
                    }
                }
            }
            return _this;
        }
        /**
         * Remove current element
         */
        HTMLElement.prototype.remove = function () {
            var _this = this;
            if (this.parentNode) {
                var children = this.parentNode.childNodes;
                this.parentNode.childNodes = children.filter(function (child) {
                    return _this !== child;
                });
            }
        };
        /**
         * Remove Child element from childNodes array
         * @param {HTMLElement} node     node to remove
         */
        HTMLElement.prototype.removeChild = function (node) {
            this.childNodes = this.childNodes.filter(function (child) {
                return (child !== node);
            });
        };
        /**
         * Exchanges given child with new child
         * @param {HTMLElement} oldNode     node to exchange
         * @param {HTMLElement} newNode     new node
         */
        HTMLElement.prototype.exchangeChild = function (oldNode, newNode) {
            var children = this.childNodes;
            this.childNodes = children.map(function (child) {
                if (child === oldNode) {
                    return newNode;
                }
                return child;
            });
        };
        Object.defineProperty(HTMLElement.prototype, "tagName", {
            get: function () {
                return this.rawTagName ? this.rawTagName.toUpperCase() : this.rawTagName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "rawText", {
            /**
             * Get escpaed (as-it) text value of current node and its children.
             * @return {string} text content
             */
            get: function () {
                return this.childNodes.reduce(function (pre, cur) {
                    return (pre += cur.rawText);
                }, '');
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "text", {
            /**
             * Get unescaped text value of current node and its children.
             * @return {string} text content
             */
            get: function () {
                return he_1.decode(this.rawText);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "structuredText", {
            /**
             * Get structured Text (with '\n' etc.)
             * @return {string} structured text
             */
            get: function () {
                var currentBlock = [];
                var blocks = [currentBlock];
                function dfs(node) {
                    if (node.nodeType === type_3.default.ELEMENT_NODE) {
                        if (kBlockElements.get(node.rawTagName)) {
                            if (currentBlock.length > 0) {
                                blocks.push(currentBlock = []);
                            }
                            node.childNodes.forEach(dfs);
                            if (currentBlock.length > 0) {
                                blocks.push(currentBlock = []);
                            }
                        }
                        else {
                            node.childNodes.forEach(dfs);
                        }
                    }
                    else if (node.nodeType === type_3.default.TEXT_NODE) {
                        if (node.isWhitespace) {
                            // Whitespace node, postponed output
                            currentBlock.prependWhitespace = true;
                        }
                        else {
                            var text = node.text;
                            if (currentBlock.prependWhitespace) {
                                text = " " + text;
                                currentBlock.prependWhitespace = false;
                            }
                            currentBlock.push(text);
                        }
                    }
                }
                dfs(this);
                return blocks.map(function (block) {
                    // Normalize each line's whitespace
                    return block.join('').trim().replace(/\s{2,}/g, ' ');
                })
                    .join('\n').replace(/\s+$/, ''); // trimRight;
            },
            enumerable: false,
            configurable: true
        });
        HTMLElement.prototype.toString = function () {
            var tag = this.rawTagName;
            if (tag) {
                var is_void = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(tag);
                var attrs = this.rawAttrs ? " " + this.rawAttrs : '';
                if (is_void) {
                    return "<" + tag + attrs + ">";
                }
                return "<" + tag + attrs + ">" + this.innerHTML + "</" + tag + ">";
            }
            return this.innerHTML;
        };
        Object.defineProperty(HTMLElement.prototype, "innerHTML", {
            get: function () {
                return this.childNodes.map(function (child) {
                    return child.toString();
                }).join('');
            },
            enumerable: false,
            configurable: true
        });
        HTMLElement.prototype.set_content = function (content, options) {
            if (options === void 0) { options = {}; }
            if (content instanceof node_3.default) {
                content = [content];
            }
            else if (typeof content == 'string') {
                var r = parse(content, options);
                content = r.childNodes.length ? r.childNodes : [new text_1.default(content)];
            }
            this.childNodes = content;
        };
        Object.defineProperty(HTMLElement.prototype, "outerHTML", {
            get: function () {
                return this.toString();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Trim element from right (in block) after seeing pattern in a TextNode.
         * @param  {RegExp} pattern pattern to find
         * @return {HTMLElement}    reference to current node
         */
        HTMLElement.prototype.trimRight = function (pattern) {
            for (var i = 0; i < this.childNodes.length; i++) {
                var childNode = this.childNodes[i];
                if (childNode.nodeType === type_3.default.ELEMENT_NODE) {
                    childNode.trimRight(pattern);
                }
                else {
                    var index = childNode.rawText.search(pattern);
                    if (index > -1) {
                        childNode.rawText = childNode.rawText.substr(0, index);
                        // trim all following nodes.
                        this.childNodes.length = i + 1;
                    }
                }
            }
            return this;
        };
        Object.defineProperty(HTMLElement.prototype, "structure", {
            /**
             * Get DOM structure
             * @return {string} strucutre
             */
            get: function () {
                var res = [];
                var indention = 0;
                function write(str) {
                    res.push('  '.repeat(indention) + str);
                }
                function dfs(node) {
                    var idStr = node.id ? ("#" + node.id) : '';
                    var classStr = node.classNames.length ? ("." + node.classNames.join('.')) : '';
                    write(node.rawTagName + idStr + classStr);
                    indention++;
                    node.childNodes.forEach(function (childNode) {
                        if (childNode.nodeType === type_3.default.ELEMENT_NODE) {
                            dfs(childNode);
                        }
                        else if (childNode.nodeType === type_3.default.TEXT_NODE) {
                            if (!childNode.isWhitespace) {
                                write('#text');
                            }
                        }
                    });
                    indention--;
                }
                dfs(this);
                return res.join('\n');
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Remove whitespaces in this sub tree.
         * @return {HTMLElement} pointer to this
         */
        HTMLElement.prototype.removeWhitespace = function () {
            var _this = this;
            var o = 0;
            this.childNodes.forEach(function (node) {
                if (node.nodeType === type_3.default.TEXT_NODE) {
                    if (node.isWhitespace) {
                        return;
                    }
                    node.rawText = node.rawText.trim();
                }
                else if (node.nodeType === type_3.default.ELEMENT_NODE) {
                    node.removeWhitespace();
                }
                _this.childNodes[o++] = node;
            });
            this.childNodes.length = o;
            return this;
        };
        /**
         * Query CSS selector to find matching nodes.
         * @param  {string}         selector Simplified CSS selector
         * @param  {Matcher}        selector A Matcher instance
         * @return {HTMLElement[]}  matching elements
         */
        HTMLElement.prototype.querySelectorAll = function (selector) {
            var _this = this;
            var matcher;
            if (selector instanceof matcher_1.default) {
                matcher = selector;
                matcher.reset();
            }
            else {
                if (selector.includes(',')) {
                    var selectors = selector.split(',');
                    return Array.from(selectors.reduce(function (pre, cur) {
                        var result = _this.querySelectorAll(cur.trim());
                        return result.reduce(function (p, c) {
                            return p.add(c);
                        }, pre);
                    }, new Set()));
                }
                matcher = new matcher_1.default(selector);
            }
            var stack = [];
            return this.childNodes.reduce(function (res, cur) {
                stack.push([cur, 0, false]);
                while (stack.length) {
                    var state = back_1.default(stack); // get last element
                    var el = state[0];
                    if (state[1] === 0) {
                        // Seen for first time.
                        if (el.nodeType !== type_3.default.ELEMENT_NODE) {
                            stack.pop();
                            continue;
                        }
                        var html_el = el;
                        state[2] = matcher.advance(html_el);
                        if (state[2]) {
                            if (matcher.matched) {
                                res.push(html_el);
                                res.push.apply(res, (html_el.querySelectorAll(selector)));
                                // no need to go further.
                                matcher.rewind();
                                stack.pop();
                                continue;
                            }
                        }
                    }
                    if (state[1] < el.childNodes.length) {
                        stack.push([el.childNodes[state[1]++], 0, false]);
                    }
                    else {
                        if (state[2]) {
                            matcher.rewind();
                        }
                        stack.pop();
                    }
                }
                return res;
            }, []);
        };
        /**
         * Query CSS Selector to find matching node.
         * @param  {string}         selector Simplified CSS selector
         * @param  {Matcher}        selector A Matcher instance
         * @return {HTMLElement}    matching node
         */
        HTMLElement.prototype.querySelector = function (selector) {
            var matcher;
            if (selector instanceof matcher_1.default) {
                matcher = selector;
                matcher.reset();
            }
            else {
                matcher = new matcher_1.default(selector);
            }
            var stack = [];
            for (var _i = 0, _a = this.childNodes; _i < _a.length; _i++) {
                var node = _a[_i];
                stack.push([node, 0, false]);
                while (stack.length) {
                    var state = back_1.default(stack);
                    var el = state[0];
                    if (state[1] === 0) {
                        // Seen for first time.
                        if (el.nodeType !== type_3.default.ELEMENT_NODE) {
                            stack.pop();
                            continue;
                        }
                        state[2] = matcher.advance(el);
                        if (state[2]) {
                            if (matcher.matched) {
                                return el;
                            }
                        }
                    }
                    if (state[1] < el.childNodes.length) {
                        stack.push([el.childNodes[state[1]++], 0, false]);
                    }
                    else {
                        if (state[2]) {
                            matcher.rewind();
                        }
                        stack.pop();
                    }
                }
            }
            return null;
        };
        /**
         * Append a child node to childNodes
         * @param  {Node} node node to append
         * @return {Node}      node appended
         */
        HTMLElement.prototype.appendChild = function (node) {
            // node.parentNode = this;
            this.childNodes.push(node);
            if (node instanceof HTMLElement) {
                node.parentNode = this;
            }
            return node;
        };
        Object.defineProperty(HTMLElement.prototype, "firstChild", {
            /**
             * Get first child node
             * @return {Node} first child node
             */
            get: function () {
                return this.childNodes[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "lastChild", {
            /**
             * Get last child node
             * @return {Node} last child node
             */
            get: function () {
                return back_1.default(this.childNodes);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "attributes", {
            /**
             * Get attributes
             * @return {Object} parsed and unescaped attributes
             */
            get: function () {
                if (this._attrs) {
                    return this._attrs;
                }
                this._attrs = {};
                var attrs = this.rawAttributes;
                for (var key in attrs) {
                    var val = attrs[key] || '';
                    this._attrs[key] = he_1.decode(val);
                }
                return this._attrs;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "rawAttributes", {
            /**
             * Get escaped (as-it) attributes
             * @return {Object} parsed attributes
             */
            get: function () {
                if (this._rawAttrs) {
                    return this._rawAttrs;
                }
                var attrs = {};
                if (this.rawAttrs) {
                    var re = /\b([a-z][a-z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/ig;
                    var match = void 0;
                    while ((match = re.exec(this.rawAttrs))) {
                        attrs[match[1]] = match[2] || match[3] || match[4] || null;
                    }
                }
                this._rawAttrs = attrs;
                return attrs;
            },
            enumerable: false,
            configurable: true
        });
        HTMLElement.prototype.removeAttribute = function (key) {
            var attrs = this.rawAttributes;
            delete attrs[key];
            // Update this.attribute
            if (this._attrs) {
                delete this._attrs[key];
            }
            // Update rawString
            this.rawAttrs = Object.keys(attrs).map(function (name) {
                var val = JSON.stringify(attrs[name]);
                if (val === undefined || val === 'null') {
                    return name;
                }
                return name + "=" + val;
            }).join(' ');
        };
        HTMLElement.prototype.hasAttribute = function (key) {
            return key in this.attributes;
        };
        /**
         * Get an attribute
         * @return {string} value of the attribute
         */
        HTMLElement.prototype.getAttribute = function (key) {
            return this.attributes[key];
        };
        /**
         * Set an attribute value to the HTMLElement
         * @param {string} key The attribute name
         * @param {string} value The value to set, or null / undefined to remove an attribute
         */
        HTMLElement.prototype.setAttribute = function (key, value) {
            if (arguments.length < 2) {
                throw new Error('Failed to execute \'setAttribute\' on \'Element\'');
            }
            var attrs = this.rawAttributes;
            attrs[key] = String(value);
            if (this._attrs) {
                this._attrs[key] = he_1.decode(attrs[key]);
            }
            // Update rawString
            this.rawAttrs = Object.keys(attrs).map(function (name) {
                var val = JSON.stringify(attrs[name]);
                if (val === 'null' || val === '""') {
                    return name;
                }
                return name + "=" + val;
            }).join(' ');
        };
        /**
         * Replace all the attributes of the HTMLElement by the provided attributes
         * @param {Attributes} attributes the new attribute set
         */
        HTMLElement.prototype.setAttributes = function (attributes) {
            // Invalidate current this.attributes
            if (this._attrs) {
                delete this._attrs;
            }
            // Invalidate current this.rawAttributes
            if (this._rawAttrs) {
                delete this._rawAttrs;
            }
            // Update rawString
            this.rawAttrs = Object.keys(attributes).map(function (name) {
                var val = attributes[name];
                if (val === 'null' || val === '""') {
                    return name;
                }
                return name + "=" + JSON.stringify(String(val));
            }).join(' ');
        };
        HTMLElement.prototype.insertAdjacentHTML = function (where, html) {
            var _a, _b, _c;
            var _this = this;
            if (arguments.length < 2) {
                throw new Error('2 arguments required');
            }
            var p = parse(html);
            if (where === 'afterend') {
                var idx = this.parentNode.childNodes.findIndex(function (child) {
                    return child === _this;
                });
                (_a = this.parentNode.childNodes).splice.apply(_a, __spreadArrays([idx + 1, 0], p.childNodes));
                p.childNodes.forEach(function (n) {
                    if (n instanceof HTMLElement) {
                        n.parentNode = _this.parentNode;
                    }
                });
            }
            else if (where === 'afterbegin') {
                (_b = this.childNodes).unshift.apply(_b, p.childNodes);
            }
            else if (where === 'beforeend') {
                p.childNodes.forEach(function (n) {
                    _this.appendChild(n);
                });
            }
            else if (where === 'beforebegin') {
                var idx = this.parentNode.childNodes.findIndex(function (child) {
                    return child === _this;
                });
                (_c = this.parentNode.childNodes).splice.apply(_c, __spreadArrays([idx, 0], p.childNodes));
                p.childNodes.forEach(function (n) {
                    if (n instanceof HTMLElement) {
                        n.parentNode = _this.parentNode;
                    }
                });
            }
            else {
                throw new Error("The value provided ('" + where + "') is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'");
            }
            // if (!where || html === undefined || html === null) {
            // 	return;
            // }
        };
        Object.defineProperty(HTMLElement.prototype, "nextSibling", {
            get: function () {
                if (this.parentNode) {
                    var children = this.parentNode.childNodes;
                    var i = 0;
                    while (i < children.length) {
                        var child = children[i++];
                        if (this === child) {
                            return children[i] || null;
                        }
                    }
                    return null;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(HTMLElement.prototype, "nextElementSibling", {
            get: function () {
                if (this.parentNode) {
                    var children = this.parentNode.childNodes;
                    var i = 0;
                    var find = false;
                    while (i < children.length) {
                        var child = children[i++];
                        if (find) {
                            if (child instanceof HTMLElement) {
                                return child || null;
                            }
                        }
                        else if (this === child) {
                            find = true;
                        }
                    }
                    return null;
                }
            },
            enumerable: false,
            configurable: true
        });
        return HTMLElement;
    }(node_3.default));
    exports.default = HTMLElement;
    // https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
    var kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.:0-9_a-z]*)\s*([^>]*?)(\/?)>/ig;
    // <(?<tag>[^\s]*)(.*)>(.*)</\k<tag>>
    // <([a-z][-.:0-9_a-z]*)\s*\/>
    // <(area|base|br|col|hr|img|input|link|meta|source)\s*(.*)\/?>
    // <(area|base|br|col|hr|img|input|link|meta|source)\s*(.*)\/?>|<(?<tag>[^\s]*)(.*)>(.*)</\k<tag>>
    var kAttributePattern = /(^|\s)(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;
    var kSelfClosingElements = {
        area: true,
        AREA: true,
        base: true,
        BASE: true,
        br: true,
        BR: true,
        col: true,
        COL: true,
        hr: true,
        HR: true,
        img: true,
        IMG: true,
        input: true,
        INPUT: true,
        link: true,
        LINK: true,
        meta: true,
        META: true,
        source: true,
        SOURCE: true,
        embed: true,
        EMBED: true,
        param: true,
        PARAM: true,
        track: true,
        TRACK: true,
        wbr: true,
        WBR: true
    };
    var kElementsClosedByOpening = {
        li: { li: true, LI: true },
        LI: { li: true, LI: true },
        p: { p: true, div: true, P: true, DIV: true },
        P: { p: true, div: true, P: true, DIV: true },
        b: { div: true, DIV: true },
        B: { div: true, DIV: true },
        td: { td: true, th: true, TD: true, TH: true },
        TD: { td: true, th: true, TD: true, TH: true },
        th: { td: true, th: true, TD: true, TH: true },
        TH: { td: true, th: true, TD: true, TH: true },
        h1: { h1: true, H1: true },
        H1: { h1: true, H1: true },
        h2: { h2: true, H2: true },
        H2: { h2: true, H2: true },
        h3: { h3: true, H3: true },
        H3: { h3: true, H3: true },
        h4: { h4: true, H4: true },
        H4: { h4: true, H4: true },
        h5: { h5: true, H5: true },
        H5: { h5: true, H5: true },
        h6: { h6: true, H6: true },
        H6: { h6: true, H6: true }
    };
    var kElementsClosedByClosing = {
        li: { ul: true, ol: true, UL: true, OL: true },
        LI: { ul: true, ol: true, UL: true, OL: true },
        a: { div: true, DIV: true },
        A: { div: true, DIV: true },
        b: { div: true, DIV: true },
        B: { div: true, DIV: true },
        i: { div: true, DIV: true },
        I: { div: true, DIV: true },
        p: { div: true, DIV: true },
        P: { div: true, DIV: true },
        td: { tr: true, table: true, TR: true, TABLE: true },
        TD: { tr: true, table: true, TR: true, TABLE: true },
        th: { tr: true, table: true, TR: true, TABLE: true },
        TH: { tr: true, table: true, TR: true, TABLE: true }
    };
    var frameflag = 'documentfragmentcontainer';
    function parse(data, options) {
        if (options === void 0) { options = { lowerCaseTagName: false, comment: false }; }
        var elements = options.blockTextElements || {
            script: true,
            noscript: true,
            style: true,
            pre: true
        };
        var element_names = Object.keys(elements);
        var kBlockTextElements = element_names.map(function (it) {
            return new RegExp(it, 'i');
        });
        var kIgnoreElements = element_names.filter(function (it) {
            return elements[it];
        }).map(function (it) {
            return new RegExp(it, 'i');
        });
        function element_should_be_ignore(tag) {
            return kIgnoreElements.some(function (it) {
                return it.test(tag);
            });
        }
        function is_block_text_element(tag) {
            return kBlockTextElements.some(function (it) {
                return it.test(tag);
            });
        }
        var root = new HTMLElement(null, {});
        var currentParent = root;
        var stack = [root];
        var lastTextPos = -1;
        var match;
        // https://github.com/taoqf/node-html-parser/issues/38
        data = "<" + frameflag + ">" + data + "</" + frameflag + ">";
        var _loop_1 = function () {
            if (lastTextPos > -1) {
                if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
                    // if has content
                    var text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
                    currentParent.appendChild(new text_1.default(text));
                }
            }
            lastTextPos = kMarkupPattern.lastIndex;
            if (match[2] === frameflag) {
                return "continue";
            }
            if (match[0][1] === '!') {
                // this is a comment
                if (options.comment) {
                    // Only keep what is in between <!-- and -->
                    var text = data.substring(lastTextPos - 3, lastTextPos - match[0].length + 4);
                    currentParent.appendChild(new comment_1.default(text));
                }
                return "continue";
            }
            if (options.lowerCaseTagName) {
                match[2] = match[2].toLowerCase();
            }
            if (!match[1]) {
                // not </ tags
                var attrs = {};
                for (var attMatch = void 0; (attMatch = kAttributePattern.exec(match[3]));) {
                    attrs[attMatch[2].toLowerCase()] = attMatch[4] || attMatch[5] || attMatch[6];
                }
                var tagName = currentParent.rawTagName;
                if (!match[4] && kElementsClosedByOpening[tagName]) {
                    if (kElementsClosedByOpening[tagName][match[2]]) {
                        stack.pop();
                        currentParent = back_1.default(stack);
                    }
                }
                // ignore container tag we add above
                // https://github.com/taoqf/node-html-parser/issues/38
                currentParent = currentParent.appendChild(new HTMLElement(match[2], attrs, match[3]));
                stack.push(currentParent);
                if (is_block_text_element(match[2])) {
                    // a little test to find next </script> or </style> ...
                    var closeMarkup_1 = "</" + match[2] + ">";
                    var index = (function () {
                        if (options.lowerCaseTagName) {
                            return data.toLocaleLowerCase().indexOf(closeMarkup_1, kMarkupPattern.lastIndex);
                        }
                        return data.indexOf(closeMarkup_1, kMarkupPattern.lastIndex);
                    })();
                    if (element_should_be_ignore(match[2])) {
                        var text = void 0;
                        if (index === -1) {
                            // there is no matching ending for the text element.
                            text = data.substr(kMarkupPattern.lastIndex);
                        }
                        else {
                            text = data.substring(kMarkupPattern.lastIndex, index);
                        }
                        if (text.length > 0) {
                            currentParent.appendChild(new text_1.default(text));
                        }
                    }
                    if (index === -1) {
                        lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
                    }
                    else {
                        lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup_1.length;
                        match[1] = 'true';
                    }
                }
            }
            if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
                // </ or /> or <br> etc.
                while (true) {
                    if (currentParent.rawTagName === match[2]) {
                        stack.pop();
                        currentParent = back_1.default(stack);
                        break;
                    }
                    else {
                        var tagName = currentParent.tagName;
                        // Trying to close current tag, and move on
                        if (kElementsClosedByClosing[tagName]) {
                            if (kElementsClosedByClosing[tagName][match[2]]) {
                                stack.pop();
                                currentParent = back_1.default(stack);
                                continue;
                            }
                        }
                        // Use aggressive strategy to handle unmatching markups.
                        break;
                    }
                }
            }
        };
        while ((match = kMarkupPattern.exec(data))) {
            _loop_1();
        }
        var valid = Boolean(stack.length === 1);
        if (!options.noFix) {
            var response_1 = root;
            response_1.valid = valid;
            var _loop_2 = function () {
                // Handle each error elements.
                var last = stack.pop();
                var oneBefore = back_1.default(stack);
                if (last.parentNode && last.parentNode.parentNode) {
                    if (last.parentNode === oneBefore && last.tagName === oneBefore.tagName) {
                        // Pair error case <h3> <h3> handle : Fixes to <h3> </h3>
                        oneBefore.removeChild(last);
                        last.childNodes.forEach(function (child) {
                            oneBefore.parentNode.appendChild(child);
                        });
                        stack.pop();
                    }
                    else {
                        // Single error  <div> <h3> </div> handle: Just removes <h3>
                        oneBefore.removeChild(last);
                        last.childNodes.forEach(function (child) {
                            oneBefore.appendChild(child);
                        });
                    }
                }
                else {
                    // If it's final element just skip.
                }
            };
            while (stack.length > 1) {
                _loop_2();
            }
            response_1.childNodes.forEach(function (node) {
                if (node instanceof HTMLElement) {
                    node.parentNode = null;
                }
            });
            return response_1;
        }
        var response = new text_1.default(data);
        response.valid = valid;
        return response;
    }
    exports.parse = parse;
});
define("index", ["require", "exports", "nodes/comment", "nodes/html", "nodes/node", "nodes/text", "nodes/type"], function (require, exports, comment_2, html_1, node_4, text_2, type_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NodeType = exports.TextNode = exports.Node = exports.default = exports.parse = exports.HTMLElement = exports.CommentNode = void 0;
    Object.defineProperty(exports, "CommentNode", { enumerable: true, get: function () { return __importDefault(comment_2).default; } });
    Object.defineProperty(exports, "HTMLElement", { enumerable: true, get: function () { return __importDefault(html_1).default; } });
    Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return html_1.parse; } });
    Object.defineProperty(exports, "default", { enumerable: true, get: function () { return html_1.parse; } });
    Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return __importDefault(node_4).default; } });
    Object.defineProperty(exports, "TextNode", { enumerable: true, get: function () { return __importDefault(text_2).default; } });
    Object.defineProperty(exports, "NodeType", { enumerable: true, get: function () { return __importDefault(type_4).default; } });
});
