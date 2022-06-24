import NodeType from './type';
/**
 * Node Class as base class for TextNode and HTMLElement.
 */
export default abstract class Node {
    abstract nodeType: NodeType;
    childNodes: Node[];
    abstract text: string;
    abstract rawText: string;
    abstract toString(): string;
    get innerText(): string;
}
