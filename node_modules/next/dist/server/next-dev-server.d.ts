/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { CustomRoutes } from '../lib/load-custom-routes';
import { __ApiPreviewProps } from '../next-server/server/api-utils';
import Server, { ServerConstructor } from '../next-server/server/next-server';
import { Params } from '../next-server/server/router';
export default class DevServer extends Server {
    private devReady;
    private setDevReady?;
    private webpackWatcher?;
    private hotReloader?;
    private isCustomServer;
    protected sortedRoutes?: string[];
    protected staticPathsWorker: import('jest-worker').default & {
        loadStaticPaths: typeof import('./static-paths-worker').loadStaticPaths;
    };
    constructor(options: ServerConstructor & {
        isNextDevCommand?: boolean;
    });
    protected currentPhase(): string;
    protected readBuildId(): string;
    addExportPathMapRoutes(): Promise<void>;
    startWatcher(): Promise<void>;
    stopWatcher(): Promise<void>;
    prepare(): Promise<void>;
    protected close(): Promise<void>;
    protected hasPage(pathname: string): Promise<boolean>;
    protected _beforeCatchAllRender(req: IncomingMessage, res: ServerResponse, params: Params, parsedUrl: UrlWithParsedQuery): Promise<boolean>;
    run(req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery): Promise<void>;
    protected getCustomRoutes(): CustomRoutes;
    private _devCachedPreviewProps;
    protected getPreviewProps(): __ApiPreviewProps;
    generateRoutes(): {
        basePath: string;
        headers: import("../next-server/server/router").Route[];
        rewrites: import("../next-server/server/router").Route[];
        redirects: import("../next-server/server/router").Route[];
        catchAllRoute: import("../next-server/server/router").Route;
        pageChecker: import("../next-server/server/router").PageChecker;
        useFileSystemPublicRoutes: boolean;
        dynamicRoutes: import("../next-server/server/router").DynamicRoutes | undefined;
        locales: string[];
        fsRoutes: import("../next-server/server/router").Route[];
    };
    protected generatePublicRoutes(): never[];
    protected getDynamicRoutes(): never[];
    _filterAmpDevelopmentScript(html: string, event: {
        line: number;
        col: number;
        code: string;
    }): boolean;
    protected getStaticPaths(pathname: string): Promise<{
        staticPaths: string[] | undefined;
        fallbackMode: false | 'static' | 'blocking';
    }>;
    protected ensureApiPage(pathname: string): Promise<any>;
    renderToHTML(req: IncomingMessage, res: ServerResponse, pathname: string, query: {
        [key: string]: string;
    }): Promise<string | null>;
    renderErrorToHTML(err: Error | null, req: IncomingMessage, res: ServerResponse, pathname: string, query: {
        [key: string]: string;
    }): Promise<string | null>;
    sendHTML(req: IncomingMessage, res: ServerResponse, html: string): Promise<void>;
    protected setImmutableAssetCacheControl(res: ServerResponse): void;
    private servePublic;
    hasPublicFile(path: string): Promise<boolean>;
    getCompilationError(page: string): Promise<any>;
    protected isServeableUrl(untrustedFileUrl: string): boolean;
}
