import type { NodejsRequestData, FetchEventResult } from '../types';
import { EdgeFunctionDefinition } from '../../../build/webpack/plugins/middleware-plugin';
export declare const ErrorSource: unique symbol;
declare type RunnerFn = (params: {
    name: string;
    env: string[];
    onWarning?: (warn: Error) => void;
    paths: string[];
    request: NodejsRequestData;
    useCache: boolean;
    edgeFunctionEntry: Pick<EdgeFunctionDefinition, 'wasm' | 'assets'>;
    distDir: string;
}) => Promise<FetchEventResult>;
export declare const run: RunnerFn;
export {};
