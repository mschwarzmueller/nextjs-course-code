/// <reference types="node" />
import { UrlWithParsedQuery } from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import Server from './next-server';
export declare function imageOptimizer(server: Server, req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery): Promise<{
    finished: boolean;
}>;
export declare function getMaxAge(str: string | null): number;
