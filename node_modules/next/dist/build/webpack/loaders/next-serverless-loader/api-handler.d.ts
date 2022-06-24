/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { ServerlessHandlerCtx } from './utils';
export declare function getApiHandler(ctx: ServerlessHandlerCtx): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
