import Node from './node';
import NodeType from './type';
export default class CommentNode extends Node {
    rawText: string;
    constructor(rawText: string);
    /**
     * Node Type declaration.
     * @type {Number}
     */
    nodeType: NodeType;
    /**
     * Get unescaped text value of current node and its children.
     * @return {string} text content
     */
    get text(): string;
    toString(): string;
}
