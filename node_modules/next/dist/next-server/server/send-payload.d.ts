/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
declare type PayloadOptions = {
    private: true;
} | {
    private: boolean;
    stateful: true;
} | {
    private: boolean;
    stateful: false;
    revalidate: number | false;
};
export declare function setRevalidateHeaders(res: ServerResponse, options: PayloadOptions): void;
export declare function sendPayload(req: IncomingMessage, res: ServerResponse, payload: any, type: 'html' | 'json', { generateEtags, poweredByHeader, }: {
    generateEtags: boolean;
    poweredByHeader: boolean;
}, options?: PayloadOptions): void;
export declare function sendEtagResponse(req: IncomingMessage, res: ServerResponse, etag: string | undefined): boolean;
export {};
