/// <reference types="node" />
import type { ServerResponse } from 'http';
export default class RenderResult {
    _result: string | ReadableStream<Uint8Array>;
    constructor(response: string | ReadableStream<Uint8Array>);
    toUnchunkedString(): string;
    pipe(res: ServerResponse): Promise<void>;
    isDynamic(): boolean;
    static fromStatic(value: string): RenderResult;
    static empty: RenderResult;
}
