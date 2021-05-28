import { decode } from 'he';
import Node from './node';
import NodeType from './type';
import TextNode from './text';
import Matcher from '../matcher';
import arr_back from '../back';
import CommentNode from './comment';
const kBlockElements = new Map();
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
export default class HTMLElement extends Node {
    /**
     * Creates an instance of HTMLElement.
     * @param keyAttrs	id and class attribute
     * @param [rawAttrs]	attributes in string
     *
     * @memberof HTMLElement
     */
    constructor(tagName, keyAttrs, rawAttrs = '', parentNode = null) {
        super();
        this.rawAttrs = rawAttrs;
        this.parentNode = parentNode;
        this.classNames = [];
        /**
         * Node Type declaration.
         */
        this.nodeType = NodeType.ELEMENT_NODE;
        this.rawTagName = tagName;
        this.rawAttrs = rawAttrs || '';
        this.parentNode = parentNode || null;
        this.childNodes = [];
        if (keyAttrs.id) {
            this.id = keyAttrs.id;
            if (!rawAttrs) {
                this.rawAttrs = `id="${keyAttrs.id}"`;
            }
        }
        if (keyAttrs.class) {
            this.classNames = keyAttrs.class.split(/\s+/);
            if (!rawAttrs) {
                const cls = `class="${this.classNames.join(' ')}"`;
                if (this.rawAttrs) {
                    this.rawAttrs += ` ${cls}`;
                }
                else {
                    this.rawAttrs = cls;
                }
            }
        }
    }
    /**
     * Remove current element
     */
    remove() {
        if (this.parentNode) {
            const children = this.parentNode.childNodes;
            this.parentNode.childNodes = children.filter((child) => {
                return this !== child;
            });
        }
    }
    /**
     * Remove Child element from childNodes array
     * @param {HTMLElement} node     node to remove
     */
    removeChild(node) {
        this.childNodes = this.childNodes.filter((child) => {
            return (child !== node);
        });
    }
    /**
     * Exchanges given child with new child
     * @param {HTMLElement} oldNode     node to exchange
     * @param {HTMLElement} newNode     new node
     */
    exchangeChild(oldNode, newNode) {
        const children = this.childNodes;
        this.childNodes = children.map((child) => {
            if (child === oldNode) {
                return newNode;
            }
            return child;
        });
    }
    get tagName() {
        return this.rawTagName ? this.rawTagName.toUpperCase() : this.rawTagName;
    }
    /**
     * Get escpaed (as-it) text value of current node and its children.
     * @return {string} text content
     */
    get rawText() {
        return this.childNodes.reduce((pre, cur) => {
            return (pre += cur.rawText);
        }, '');
    }
    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get text() {
        return decode(this.rawText);
    }
    /**
     * Get structured Text (with '\n' etc.)
     * @return {string} structured text
     */
    get structuredText() {
        let currentBlock = [];
        const blocks = [currentBlock];
        function dfs(node) {
            if (node.nodeType === NodeType.ELEMENT_NODE) {
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
            else if (node.nodeType === NodeType.TEXT_NODE) {
                if (node.isWhitespace) {
                    // Whitespace node, postponed output
                    currentBlock.prependWhitespace = true;
                }
                else {
                    let text = node.text;
                    if (currentBlock.prependWhitespace) {
                        text = ` ${text}`;
                        currentBlock.prependWhitespace = false;
                    }
                    currentBlock.push(text);
                }
            }
        }
        dfs(this);
        return blocks.map((block) => {
            // Normalize each line's whitespace
            return block.join('').trim().replace(/\s{2,}/g, ' ');
        })
            .join('\n').replace(/\s+$/, ''); // trimRight;
    }
    toString() {
        const tag = this.rawTagName;
        if (tag) {
            const is_void = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(tag);
            const attrs = this.rawAttrs ? ` ${this.rawAttrs}` : '';
            if (is_void) {
                return `<${tag}${attrs}>`;
            }
            return `<${tag}${attrs}>${this.innerHTML}</${tag}>`;
        }
        return this.innerHTML;
    }
    get innerHTML() {
        return this.childNodes.map((child) => {
            return child.toString();
        }).join('');
    }
    set_content(content, options = {}) {
        if (content instanceof Node) {
            content = [content];
        }
        else if (typeof content == 'string') {
            const r = parse(content, options);
            content = r.childNodes.length ? r.childNodes : [new TextNode(content)];
        }
        this.childNodes = content;
    }
    get outerHTML() {
        return this.toString();
    }
    /**
     * Trim element from right (in block) after seeing pattern in a TextNode.
     * @param  {RegExp} pattern pattern to find
     * @return {HTMLElement}    reference to current node
     */
    trimRight(pattern) {
        for (let i = 0; i < this.childNodes.length; i++) {
            const childNode = this.childNodes[i];
            if (childNode.nodeType === NodeType.ELEMENT_NODE) {
                childNode.trimRight(pattern);
            }
            else {
                const index = childNode.rawText.search(pattern);
                if (index > -1) {
                    childNode.rawText = childNode.rawText.substr(0, index);
                    // trim all following nodes.
                    this.childNodes.length = i + 1;
                }
            }
        }
        return this;
    }
    /**
     * Get DOM structure
     * @return {string} strucutre
     */
    get structure() {
        const res = [];
        let indention = 0;
        function write(str) {
            res.push('  '.repeat(indention) + str);
        }
        function dfs(node) {
            const idStr = node.id ? (`#${node.id}`) : '';
            const classStr = node.classNames.length ? (`.${node.classNames.join('.')}`) : '';
            write(node.rawTagName + idStr + classStr);
            indention++;
            node.childNodes.forEach((childNode) => {
                if (childNode.nodeType === NodeType.ELEMENT_NODE) {
                    dfs(childNode);
                }
                else if (childNode.nodeType === NodeType.TEXT_NODE) {
                    if (!childNode.isWhitespace) {
                        write('#text');
                    }
                }
            });
            indention--;
        }
        dfs(this);
        return res.join('\n');
    }
    /**
     * Remove whitespaces in this sub tree.
     * @return {HTMLElement} pointer to this
     */
    removeWhitespace() {
        let o = 0;
        this.childNodes.forEach((node) => {
            if (node.nodeType === NodeType.TEXT_NODE) {
                if (node.isWhitespace) {
                    return;
                }
                node.rawText = node.rawText.trim();
            }
            else if (node.nodeType === NodeType.ELEMENT_NODE) {
                node.removeWhitespace();
            }
            this.childNodes[o++] = node;
        });
        this.childNodes.length = o;
        return this;
    }
    /**
     * Query CSS selector to find matching nodes.
     * @param  {string}         selector Simplified CSS selector
     * @param  {Matcher}        selector A Matcher instance
     * @return {HTMLElement[]}  matching elements
     */
    querySelectorAll(selector) {
        let matcher;
        if (selector instanceof Matcher) {
            matcher = selector;
            matcher.reset();
        }
        else {
            if (selector.includes(',')) {
                const selectors = selector.split(',');
                return Array.from(selectors.reduce((pre, cur) => {
                    const result = this.querySelectorAll(cur.trim());
                    return result.reduce((p, c) => {
                        return p.add(c);
                    }, pre);
                }, new Set()));
            }
            matcher = new Matcher(selector);
        }
        const stack = [];
        return this.childNodes.reduce((res, cur) => {
            stack.push([cur, 0, false]);
            while (stack.length) {
                const state = arr_back(stack); // get last element
                const el = state[0];
                if (state[1] === 0) {
                    // Seen for first time.
                    if (el.nodeType !== NodeType.ELEMENT_NODE) {
                        stack.pop();
                        continue;
                    }
                    const html_el = el;
                    state[2] = matcher.advance(html_el);
                    if (state[2]) {
                        if (matcher.matched) {
                            res.push(html_el);
                            res.push(...(html_el.querySelectorAll(selector)));
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
    }
    /**
     * Query CSS Selector to find matching node.
     * @param  {string}         selector Simplified CSS selector
     * @param  {Matcher}        selector A Matcher instance
     * @return {HTMLElement}    matching node
     */
    querySelector(selector) {
        let matcher;
        if (selector instanceof Matcher) {
            matcher = selector;
            matcher.reset();
        }
        else {
            matcher = new Matcher(selector);
        }
        const stack = [];
        for (const node of this.childNodes) {
            stack.push([node, 0, false]);
            while (stack.length) {
                const state = arr_back(stack);
                const el = state[0];
                if (state[1] === 0) {
                    // Seen for first time.
                    if (el.nodeType !== NodeType.ELEMENT_NODE) {
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
    }
    /**
     * Append a child node to childNodes
     * @param  {Node} node node to append
     * @return {Node}      node appended
     */
    appendChild(node) {
        // node.parentNode = this;
        this.childNodes.push(node);
        if (node instanceof HTMLElement) {
            node.parentNode = this;
        }
        return node;
    }
    /**
     * Get first child node
     * @return {Node} first child node
     */
    get firstChild() {
        return this.childNodes[0];
    }
    /**
     * Get last child node
     * @return {Node} last child node
     */
    get lastChild() {
        return arr_back(this.childNodes);
    }
    /**
     * Get attributes
     * @return {Object} parsed and unescaped attributes
     */
    get attributes() {
        if (this._attrs) {
            return this._attrs;
        }
        this._attrs = {};
        const attrs = this.rawAttributes;
        for (const key in attrs) {
            const val = attrs[key] || '';
            this._attrs[key] = decode(val);
        }
        return this._attrs;
    }
    /**
     * Get escaped (as-it) attributes
     * @return {Object} parsed attributes
     */
    get rawAttributes() {
        if (this._rawAttrs) {
            return this._rawAttrs;
        }
        const attrs = {};
        if (this.rawAttrs) {
            const re = /\b([a-z][a-z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/ig;
            let match;
            while ((match = re.exec(this.rawAttrs))) {
                attrs[match[1]] = match[2] || match[3] || match[4] || null;
            }
        }
        this._rawAttrs = attrs;
        return attrs;
    }
    removeAttribute(key) {
        const attrs = this.rawAttributes;
        delete attrs[key];
        // Update this.attribute
        if (this._attrs) {
            delete this._attrs[key];
        }
        // Update rawString
        this.rawAttrs = Object.keys(attrs).map((name) => {
            const val = JSON.stringify(attrs[name]);
            if (val === undefined || val === 'null') {
                return name;
            }
            return `${name}=${val}`;
        }).join(' ');
    }
    hasAttribute(key) {
        return key in this.attributes;
    }
    /**
     * Get an attribute
     * @return {string} value of the attribute
     */
    getAttribute(key) {
        return this.attributes[key];
    }
    /**
     * Set an attribute value to the HTMLElement
     * @param {string} key The attribute name
     * @param {string} value The value to set, or null / undefined to remove an attribute
     */
    setAttribute(key, value) {
        if (arguments.length < 2) {
            throw new Error('Failed to execute \'setAttribute\' on \'Element\'');
        }
        const attrs = this.rawAttributes;
        attrs[key] = String(value);
        if (this._attrs) {
            this._attrs[key] = decode(attrs[key]);
        }
        // Update rawString
        this.rawAttrs = Object.keys(attrs).map((name) => {
            const val = JSON.stringify(attrs[name]);
            if (val === 'null' || val === '""') {
                return name;
            }
            return `${name}=${val}`;
        }).join(' ');
    }
    /**
     * Replace all the attributes of the HTMLElement by the provided attributes
     * @param {Attributes} attributes the new attribute set
     */
    setAttributes(attributes) {
        // Invalidate current this.attributes
        if (this._attrs) {
            delete this._attrs;
        }
        // Invalidate current this.rawAttributes
        if (this._rawAttrs) {
            delete this._rawAttrs;
        }
        // Update rawString
        this.rawAttrs = Object.keys(attributes).map((name) => {
            const val = attributes[name];
            if (val === 'null' || val === '""') {
                return name;
            }
            return `${name}=${JSON.stringify(String(val))}`;
        }).join(' ');
    }
    insertAdjacentHTML(where, html) {
        if (arguments.length < 2) {
            throw new Error('2 arguments required');
        }
        const p = parse(html);
        if (where === 'afterend') {
            const idx = this.parentNode.childNodes.findIndex((child) => {
                return child === this;
            });
            this.parentNode.childNodes.splice(idx + 1, 0, ...p.childNodes);
            p.childNodes.forEach((n) => {
                if (n instanceof HTMLElement) {
                    n.parentNode = this.parentNode;
                }
            });
        }
        else if (where === 'afterbegin') {
            this.childNodes.unshift(...p.childNodes);
        }
        else if (where === 'beforeend') {
            p.childNodes.forEach((n) => {
                this.appendChild(n);
            });
        }
        else if (where === 'beforebegin') {
            const idx = this.parentNode.childNodes.findIndex((child) => {
                return child === this;
            });
            this.parentNode.childNodes.splice(idx, 0, ...p.childNodes);
            p.childNodes.forEach((n) => {
                if (n instanceof HTMLElement) {
                    n.parentNode = this.parentNode;
                }
            });
        }
        else {
            throw new Error(`The value provided ('${where}') is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'`);
        }
        // if (!where || html === undefined || html === null) {
        // 	return;
        // }
    }
    get nextSibling() {
        if (this.parentNode) {
            const children = this.parentNode.childNodes;
            let i = 0;
            while (i < children.length) {
                const child = children[i++];
                if (this === child) {
                    return children[i] || null;
                }
            }
            return null;
        }
    }
    get nextElementSibling() {
        if (this.parentNode) {
            const children = this.parentNode.childNodes;
            let i = 0;
            let find = false;
            while (i < children.length) {
                const child = children[i++];
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
    }
}
// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
const kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.:0-9_a-z]*)\s*([^>]*?)(\/?)>/ig;
// <(?<tag>[^\s]*)(.*)>(.*)</\k<tag>>
// <([a-z][-.:0-9_a-z]*)\s*\/>
// <(area|base|br|col|hr|img|input|link|meta|source)\s*(.*)\/?>
// <(area|base|br|col|hr|img|input|link|meta|source)\s*(.*)\/?>|<(?<tag>[^\s]*)(.*)>(.*)</\k<tag>>
const kAttributePattern = /(^|\s)(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;
const kSelfClosingElements = {
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
const kElementsClosedByOpening = {
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
const kElementsClosedByClosing = {
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
const frameflag = 'documentfragmentcontainer';
export function parse(data, options = { lowerCaseTagName: false, comment: false }) {
    const elements = options.blockTextElements || {
        script: true,
        noscript: true,
        style: true,
        pre: true
    };
    const element_names = Object.keys(elements);
    const kBlockTextElements = element_names.map((it) => {
        return new RegExp(it, 'i');
    });
    const kIgnoreElements = element_names.filter((it) => {
        return elements[it];
    }).map((it) => {
        return new RegExp(it, 'i');
    });
    function element_should_be_ignore(tag) {
        return kIgnoreElements.some((it) => {
            return it.test(tag);
        });
    }
    function is_block_text_element(tag) {
        return kBlockTextElements.some((it) => {
            return it.test(tag);
        });
    }
    const root = new HTMLElement(null, {});
    let currentParent = root;
    const stack = [root];
    let lastTextPos = -1;
    let match;
    // https://github.com/taoqf/node-html-parser/issues/38
    data = `<${frameflag}>${data}</${frameflag}>`;
    while ((match = kMarkupPattern.exec(data))) {
        if (lastTextPos > -1) {
            if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
                // if has content
                const text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
                currentParent.appendChild(new TextNode(text));
            }
        }
        lastTextPos = kMarkupPattern.lastIndex;
        if (match[2] === frameflag) {
            continue;
        }
        if (match[0][1] === '!') {
            // this is a comment
            if (options.comment) {
                // Only keep what is in between <!-- and -->
                const text = data.substring(lastTextPos - 3, lastTextPos - match[0].length + 4);
                currentParent.appendChild(new CommentNode(text));
            }
            continue;
        }
        if (options.lowerCaseTagName) {
            match[2] = match[2].toLowerCase();
        }
        if (!match[1]) {
            // not </ tags
            const attrs = {};
            for (let attMatch; (attMatch = kAttributePattern.exec(match[3]));) {
                attrs[attMatch[2].toLowerCase()] = attMatch[4] || attMatch[5] || attMatch[6];
            }
            const tagName = currentParent.rawTagName;
            if (!match[4] && kElementsClosedByOpening[tagName]) {
                if (kElementsClosedByOpening[tagName][match[2]]) {
                    stack.pop();
                    currentParent = arr_back(stack);
                }
            }
            // ignore container tag we add above
            // https://github.com/taoqf/node-html-parser/issues/38
            currentParent = currentParent.appendChild(new HTMLElement(match[2], attrs, match[3]));
            stack.push(currentParent);
            if (is_block_text_element(match[2])) {
                // a little test to find next </script> or </style> ...
                const closeMarkup = `</${match[2]}>`;
                const index = (() => {
                    if (options.lowerCaseTagName) {
                        return data.toLocaleLowerCase().indexOf(closeMarkup, kMarkupPattern.lastIndex);
                    }
                    return data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
                })();
                if (element_should_be_ignore(match[2])) {
                    let text;
                    if (index === -1) {
                        // there is no matching ending for the text element.
                        text = data.substr(kMarkupPattern.lastIndex);
                    }
                    else {
                        text = data.substring(kMarkupPattern.lastIndex, index);
                    }
                    if (text.length > 0) {
                        currentParent.appendChild(new TextNode(text));
                    }
                }
                if (index === -1) {
                    lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
                }
                else {
                    lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
                    match[1] = 'true';
                }
            }
        }
        if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
            // </ or /> or <br> etc.
            while (true) {
                if (currentParent.rawTagName === match[2]) {
                    stack.pop();
                    currentParent = arr_back(stack);
                    break;
                }
                else {
                    const tagName = currentParent.tagName;
                    // Trying to close current tag, and move on
                    if (kElementsClosedByClosing[tagName]) {
                        if (kElementsClosedByClosing[tagName][match[2]]) {
                            stack.pop();
                            currentParent = arr_back(stack);
                            continue;
                        }
                    }
                    // Use aggressive strategy to handle unmatching markups.
                    break;
                }
            }
        }
    }
    const valid = Boolean(stack.length === 1);
    if (!options.noFix) {
        const response = root;
        response.valid = valid;
        while (stack.length > 1) {
            // Handle each error elements.
            const last = stack.pop();
            const oneBefore = arr_back(stack);
            if (last.parentNode && last.parentNode.parentNode) {
                if (last.parentNode === oneBefore && last.tagName === oneBefore.tagName) {
                    // Pair error case <h3> <h3> handle : Fixes to <h3> </h3>
                    oneBefore.removeChild(last);
                    last.childNodes.forEach((child) => {
                        oneBefore.parentNode.appendChild(child);
                    });
                    stack.pop();
                }
                else {
                    // Single error  <div> <h3> </div> handle: Just removes <h3>
                    oneBefore.removeChild(last);
                    last.childNodes.forEach((child) => {
                        oneBefore.appendChild(child);
                    });
                }
            }
            else {
                // If it's final element just skip.
            }
        }
        response.childNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
                node.parentNode = null;
            }
        });
        return response;
    }
    const response = new TextNode(data);
    response.valid = valid;
    return response;
}
