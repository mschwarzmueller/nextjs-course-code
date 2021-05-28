/// <reference types="react" />
export declare const DOMAttributeNames: Record<string, string>;
export default function initHeadManager(): {
    mountedInstances: Set<unknown>;
    updateHead: (head: JSX.Element[]) => void;
};
