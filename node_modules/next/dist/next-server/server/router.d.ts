/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
export declare const route: (path: string) => (pathname: string | null | undefined, params?: any) => any;
export declare type Params = {
    [param: string]: any;
};
export declare type RouteMatch = (pathname: string | null | undefined) => false | Params;
declare type RouteResult = {
    finished: boolean;
    pathname?: string;
    query?: {
        [k: string]: string;
    };
};
export declare type Route = {
    match: RouteMatch;
    type: string;
    check?: boolean;
    statusCode?: number;
    name: string;
    requireBasePath?: false;
    internal?: true;
    fn: (req: IncomingMessage, res: ServerResponse, params: Params, parsedUrl: UrlWithParsedQuery) => Promise<RouteResult> | RouteResult;
};
export declare type DynamicRoutes = Array<{
    page: string;
    match: RouteMatch;
}>;
export declare type PageChecker = (pathname: string) => Promise<boolean>;
export default class Router {
    basePath: string;
    headers: Route[];
    fsRoutes: Route[];
    rewrites: Route[];
    redirects: Route[];
    catchAllRoute: Route;
    pageChecker: PageChecker;
    dynamicRoutes: DynamicRoutes;
    useFileSystemPublicRoutes: boolean;
    locales: string[];
    constructor({ basePath, headers, fsRoutes, rewrites, redirects, catchAllRoute, dynamicRoutes, pageChecker, useFileSystemPublicRoutes, locales, }: {
        basePath: string;
        headers: Route[];
        fsRoutes: Route[];
        rewrites: Route[];
        redirects: Route[];
        catchAllRoute: Route;
        dynamicRoutes: DynamicRoutes | undefined;
        pageChecker: PageChecker;
        useFileSystemPublicRoutes: boolean;
        locales: string[];
    });
    setDynamicRoutes(routes?: DynamicRoutes): void;
    addFsRoute(fsRoute: Route): void;
    execute(req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery): Promise<boolean>;
}
export {};
