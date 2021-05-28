/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { ServerlessHandlerCtx } from './utils';
export declare function getPageHandler(ctx: ServerlessHandlerCtx): {
    renderReqToHTML: (req: IncomingMessage, res: ServerResponse, renderMode?: true | "export" | "passthrough" | undefined, _renderOpts?: any, _params?: any) => Promise<string | {
        html: string | null;
        renderOpts: any;
    } | null>;
    render: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
};
