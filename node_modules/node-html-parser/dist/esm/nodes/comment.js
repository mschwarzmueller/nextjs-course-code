import Node from './node';
import NodeType from './type';
export default class CommentNode extends Node {
    constructor(rawText) {
        super();
        this.rawText = rawText;
        /**
         * Node Type declaration.
         * @type {Number}
         */
        this.nodeType = NodeType.COMMENT_NODE;
    }
    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get text() {
        return this.rawText;
    }
    toString() {
        return `<!--${this.rawText}-->`;
    }
}
