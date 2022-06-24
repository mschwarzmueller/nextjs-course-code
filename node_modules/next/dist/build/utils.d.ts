import '../next-server/server/node-polyfill-fetch';
import { CustomRoutes } from '../lib/load-custom-routes';
import { GetStaticPaths } from 'next/types';
import { BuildManifest } from '../next-server/server/get-page-files';
import { UnwrapPromise } from '../lib/coalesced-function';
export declare function collectPages(directory: string, pageExtensions: string[]): Promise<string[]>;
export interface PageInfo {
    isHybridAmp?: boolean;
    size: number;
    totalSize: number;
    static: boolean;
    isSsg: boolean;
    ssgPageRoutes: string[] | null;
    initialRevalidateSeconds: number | false;
}
export declare function printTreeView(list: readonly string[], pageInfos: Map<string, PageInfo>, serverless: boolean, { distPath, buildId, pagesDir, pageExtensions, buildManifest, useStatic404, }: {
    distPath: string;
    buildId: string;
    pagesDir: string;
    pageExtensions: string[];
    buildManifest: BuildManifest;
    useStatic404: boolean;
}): Promise<void>;
export declare function printCustomRoutes({ redirects, rewrites, headers, }: CustomRoutes): void;
export declare function difference<T>(main: T[] | Set<T>, sub: T[] | Set<T>): T[];
export declare function getJsPageSizeInKb(page: string, distPath: string, buildManifest: BuildManifest): Promise<[number, number]>;
export declare function buildStaticPaths(page: string, getStaticPaths: GetStaticPaths, locales?: string[], defaultLocale?: string): Promise<Omit<UnwrapPromise<ReturnType<GetStaticPaths>>, 'paths'> & {
    paths: string[];
    encodedPaths: string[];
}>;
export declare function isPageStatic(page: string, serverBundle: string, runtimeEnvConfig: any, locales?: string[], defaultLocale?: string, spanContext?: any): Promise<{
    isStatic?: boolean;
    isAmpOnly?: boolean;
    isHybridAmp?: boolean;
    hasServerProps?: boolean;
    hasStaticProps?: boolean;
    prerenderRoutes?: string[];
    encodedPrerenderRoutes?: string[];
    prerenderFallback?: boolean | 'blocking';
    isNextImageImported?: boolean;
}>;
export declare function hasCustomGetInitialProps(bundle: string, runtimeEnvConfig: any, checkingApp: boolean): Promise<boolean>;
export declare function getNamedExports(bundle: string, runtimeEnvConfig: any): Array<string>;
export declare function detectConflictingPaths(combinedPages: string[], ssgPages: Set<string>, additionalSsgPaths: Map<string, string[]>): void;
