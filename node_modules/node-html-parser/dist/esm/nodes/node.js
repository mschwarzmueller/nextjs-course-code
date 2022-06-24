/**
 * Node Class as base class for TextNode and HTMLElement.
 */
export default class Node {
    constructor() {
        this.childNodes = [];
    }
    get innerText() {
        return this.rawText;
    }
}
