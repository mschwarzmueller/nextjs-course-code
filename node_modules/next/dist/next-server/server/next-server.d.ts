/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { UrlWithParsedQuery } from 'url';
import { PrerenderManifest } from '../../build';
import { CustomRoutes } from '../../lib/load-custom-routes';
import { getRouteMatcher } from '../lib/router/utils';
import { __ApiPreviewProps } from './api-utils';
import { DomainLocales, NextConfig } from './config';
import Router, { DynamicRoutes, PageChecker, Params, Route } from './router';
import './node-polyfill-fetch';
import { PagesManifest } from '../../build/webpack/plugins/pages-manifest-plugin';
import { FontManifest } from './font-utils';
declare type DynamicRouteItem = {
    page: string;
    match: ReturnType<typeof getRouteMatcher>;
};
export declare type ServerConstructor = {
    /**
     * Where the Next project is located - @default '.'
     */
    dir?: string;
    /**
     * Hide error messages containing server information - @default false
     */
    quiet?: boolean;
    /**
     * Object what you would use in next.config.js - @default {}
     */
    conf?: NextConfig | null;
    dev?: boolean;
    customServer?: boolean;
};
export default class Server {
    dir: string;
    quiet: boolean;
    nextConfig: NextConfig;
    distDir: string;
    pagesDir?: string;
    publicDir: string;
    hasStaticDir: boolean;
    serverBuildDir: string;
    pagesManifest?: PagesManifest;
    buildId: string;
    minimalMode: boolean;
    renderOpts: {
        poweredByHeader: boolean;
        buildId: string;
        generateEtags: boolean;
        runtimeConfig?: {
            [key: string]: any;
        };
        assetPrefix?: string;
        canonicalBase: string;
        dev?: boolean;
        previewProps: __ApiPreviewProps;
        customServer?: boolean;
        ampOptimizerConfig?: {
            [key: string]: any;
        };
        basePath: string;
        optimizeFonts: boolean;
        images: string;
        fontManifest: FontManifest;
        optimizeImages: boolean;
        optimizeCss: any;
        locale?: string;
        locales?: string[];
        defaultLocale?: string;
        domainLocales?: DomainLocales;
    };
    private compression?;
    private onErrorMiddleware?;
    private incrementalCache;
    router: Router;
    protected dynamicRoutes?: DynamicRoutes;
    protected customRoutes: CustomRoutes;
    constructor({ dir, quiet, conf, dev, minimalMode, customServer, }?: ServerConstructor & {
        minimalMode?: boolean;
    });
    protected currentPhase(): string;
    logError(err: Error): void;
    private handleRequest;
    getRequestHandler(): (req: IncomingMessage, res: ServerResponse, parsedUrl?: UrlWithParsedQuery | undefined) => Promise<void>;
    setAssetPrefix(prefix?: string): void;
    prepare(): Promise<void>;
    protected close(): Promise<void>;
    protected setImmutableAssetCacheControl(res: ServerResponse): void;
    protected getCustomRoutes(): CustomRoutes;
    private _cachedPreviewManifest;
    protected getPrerenderManifest(): PrerenderManifest;
    protected getPreviewProps(): __ApiPreviewProps;
    protected generateRoutes(): {
        basePath: string;
        headers: Route[];
        rewrites: Route[];
        fsRoutes: Route[];
        redirects: Route[];
        catchAllRoute: Route;
        pageChecker: PageChecker;
        useFileSystemPublicRoutes: boolean;
        dynamicRoutes: DynamicRoutes | undefined;
        locales: string[];
    };
    private getPagePath;
    protected hasPage(pathname: string): Promise<boolean>;
    protected _beforeCatchAllRender(_req: IncomingMessage, _res: ServerResponse, _params: Params, _parsedUrl: UrlWithParsedQuery): Promise<boolean>;
    protected ensureApiPage(_pathname: string): Promise<void>;
    /**
     * Resolves `API` request, in development builds on demand
     * @param req http request
     * @param res http response
     * @param pathname path of request
     */
    private handleApiRequest;
    protected generatePublicRoutes(): Route[];
    protected getDynamicRoutes(): Array<DynamicRouteItem>;
    private handleCompression;
    protected run(req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery): Promise<void>;
    protected sendHTML(req: IncomingMessage, res: ServerResponse, html: string): Promise<void>;
    render(req: IncomingMessage, res: ServerResponse, pathname: string, query?: ParsedUrlQuery, parsedUrl?: UrlWithParsedQuery): Promise<void>;
    private findPageComponents;
    protected getStaticPaths(pathname: string): Promise<{
        staticPaths: string[] | undefined;
        fallbackMode: 'static' | 'blocking' | false;
    }>;
    private renderToHTMLWithComponents;
    renderToHTML(req: IncomingMessage, res: ServerResponse, pathname: string, query?: ParsedUrlQuery): Promise<string | null>;
    renderError(err: Error | null, req: IncomingMessage, res: ServerResponse, pathname: string, query?: ParsedUrlQuery, setHeaders?: boolean): Promise<void>;
    private customErrorNo404Warn;
    renderErrorToHTML(err: Error | null, req: IncomingMessage, res: ServerResponse, _pathname: string, query?: ParsedUrlQuery): Promise<string | null>;
    render404(req: IncomingMessage, res: ServerResponse, parsedUrl?: UrlWithParsedQuery, setHeaders?: boolean): Promise<void>;
    serveStatic(req: IncomingMessage, res: ServerResponse, path: string, parsedUrl?: UrlWithParsedQuery): Promise<void>;
    private _validFilesystemPathSet;
    private getFilesystemPaths;
    protected isServeableUrl(untrustedFileUrl: string): boolean;
    protected readBuildId(): string;
    protected get _isLikeServerless(): boolean;
}
export {};
