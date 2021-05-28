import HTMLElement from './nodes/html';
/**
 * Matcher class to make CSS match
 *
 * @class Matcher
 */
export default class Matcher {
    private matchers;
    private nextMatch;
    /**
     * Creates an instance of Matcher.
     * @param {string} selector
     *
     * @memberof Matcher
     */
    constructor(selector: string);
    /**
     * Trying to advance match pointer
     * @param  {HTMLElement} el element to make the match
     * @return {bool}           true when pointer advanced.
     */
    advance(el: HTMLElement): boolean;
    /**
     * Rewind the match pointer
     */
    rewind(): void;
    /**
     * Trying to determine if match made.
     * @return {bool} true when the match is made
     */
    get matched(): boolean;
    /**
     * Rest match pointer.
     * @return {[type]} [description]
     */
    reset(): void;
    /**
     * flush cache to free memory
     */
    flushCache(): void;
}
