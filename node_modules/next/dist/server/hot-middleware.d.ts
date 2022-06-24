/// <reference types="node" />
import { webpack } from 'next/dist/compiled/webpack/webpack';
import http from 'http';
export declare class WebpackHotMiddleware {
    eventStream: EventStream;
    latestStats: webpack.Stats | null;
    closed: boolean;
    constructor(compiler: webpack.Compiler);
    onInvalid: () => void;
    onDone: (statsResult: webpack.Stats) => void;
    middleware: (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => void;
    publishStats: (action: string, statsResult: webpack.Stats) => void;
    publish: (payload: any) => void;
    close: () => void;
}
declare class EventStream {
    clients: Set<http.ServerResponse>;
    interval: NodeJS.Timeout;
    constructor();
    heartbeatTick: () => void;
    everyClient(fn: (client: http.ServerResponse) => void): void;
    close(): void;
    handler(req: http.IncomingMessage, res: http.ServerResponse): void;
    publish(payload: any): void;
}
export {};
