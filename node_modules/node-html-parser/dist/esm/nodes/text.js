import NodeType from './type';
import Node from './node';
/**
 * TextNode to contain a text element in DOM tree.
 * @param {string} value [description]
 */
export default class TextNode extends Node {
    constructor(rawText) {
        super();
        this.rawText = rawText;
        /**
         * Node Type declaration.
         * @type {Number}
         */
        this.nodeType = NodeType.TEXT_NODE;
    }
    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get text() {
        return this.rawText;
    }
    /**
     * Detect if the node contains only white space.
     * @return {bool}
     */
    get isWhitespace() {
        return /^(\s|&nbsp;)*$/.test(this.rawText);
    }
    toString() {
        return this.text;
    }
}
