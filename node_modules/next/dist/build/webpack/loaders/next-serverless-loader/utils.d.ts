/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { ParsedUrlQuery } from 'querystring';
import { Rewrite } from '../../../../lib/load-custom-routes';
import { __ApiPreviewProps } from '../../../../next-server/server/api-utils';
import { BuildManifest } from '../../../../next-server/server/get-page-files';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from '../../../../types';
import { NextConfig } from '../../../../next-server/server/config';
export declare const vercelHeader = "x-vercel-id";
export declare type ServerlessHandlerCtx = {
    page: string;
    pageModule: any;
    pageComponent?: any;
    pageConfig?: any;
    pageGetStaticProps?: GetStaticProps;
    pageGetStaticPaths?: GetStaticPaths;
    pageGetServerSideProps?: GetServerSideProps;
    appModule?: any;
    errorModule?: any;
    documentModule?: any;
    notFoundModule?: any;
    runtimeConfig: any;
    buildManifest?: BuildManifest;
    reactLoadableManifest?: any;
    basePath: string;
    rewrites: Rewrite[];
    pageIsDynamic: boolean;
    generateEtags: boolean;
    distDir: string;
    buildId: string;
    escapedBuildId: string;
    assetPrefix: string;
    poweredByHeader: boolean;
    canonicalBase: string;
    encodedPreviewProps: __ApiPreviewProps;
    i18n?: NextConfig['i18n'];
    experimental: {
        initServer: () => Promise<any>;
        onError: ({ err }: {
            err: Error;
        }) => Promise<any>;
    };
};
export declare function getUtils({ page, i18n, basePath, rewrites, pageIsDynamic, }: {
    page: ServerlessHandlerCtx['page'];
    i18n?: ServerlessHandlerCtx['i18n'];
    basePath: ServerlessHandlerCtx['basePath'];
    rewrites: ServerlessHandlerCtx['rewrites'];
    pageIsDynamic: ServerlessHandlerCtx['pageIsDynamic'];
}): {
    handleLocale: (req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery, routeNoAssetPath: string, shouldNotRedirect: boolean) => {
        defaultLocale: string;
        detectedLocale: string;
        routeNoAssetPath: string;
    } | undefined;
    handleRewrites: (parsedUrl: UrlWithParsedQuery) => UrlWithParsedQuery;
    handleBasePath: (req: IncomingMessage, parsedUrl: UrlWithParsedQuery) => void;
    defaultRouteRegex: {
        re: RegExp;
        namedRegex?: string | undefined;
        routeKeys?: {
            [named: string]: string;
        } | undefined;
        groups: {
            [groupName: string]: import("../../../../next-server/lib/router/utils/route-regex").Group;
        };
    } | undefined;
    normalizeVercelUrl: (req: IncomingMessage, trustQuery: boolean) => void;
    dynamicRouteMatcher: ((pathname: string | null | undefined) => false | {
        [paramName: string]: string | string[];
    }) | undefined;
    defaultRouteMatches: ParsedUrlQuery | undefined;
    interpolateDynamicPath: (pathname: string, params: ParsedUrlQuery) => string;
    getParamsFromRouteMatches: (req: IncomingMessage, renderOpts?: any, detectedLocale?: string | undefined) => ParsedUrlQuery;
    normalizeDynamicRouteParams: (params: ParsedUrlQuery) => {
        params: ParsedUrlQuery;
        hasValidParams: boolean;
    };
};
