/// <reference types="node" />
import { ParsedUrlQuery } from 'querystring';
declare type Params = {
    [param: string]: any;
};
export declare function compileNonPath(value: string, params: Params): string;
export default function prepareDestination(destination: string, params: Params, query: ParsedUrlQuery, appendParamsToQuery: boolean): {
    newUrl: string;
    parsedDestination: {
        query?: ParsedUrlQuery | undefined;
        protocol?: string | undefined;
        hostname?: string | undefined;
        port?: string | undefined;
    } & {
        pathname: string;
        query: ParsedUrlQuery;
        search: string;
        hash: string;
        href: string;
    };
};
export {};
