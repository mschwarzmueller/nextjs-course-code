import type { NextConfigComplete } from '../server/config-shared';
import type { ServerRuntime } from '../server/config-shared';
import type { webpack5 } from 'next/dist/compiled/webpack/webpack';
import type { LoadedEnvFiles } from '@next/env';
import { __ApiPreviewProps } from '../server/api-utils';
declare type ObjectValue<T> = T extends {
    [key: string]: infer V;
} ? V : never;
/**
 * For a given page path removes the provided extensions.
 */
export declare function getPageFromPath(pagePath: string, pageExtensions: string[]): string;
export declare function createPagesMapping({ hasServerComponents, isDev, pageExtensions, pagePaths, pagesType, }: {
    hasServerComponents: boolean;
    isDev: boolean;
    pageExtensions: string[];
    pagePaths: string[];
    pagesType: 'pages' | 'root' | 'app';
}): {
    [page: string]: string;
};
interface CreateEntrypointsParams {
    buildId: string;
    config: NextConfigComplete;
    envFiles: LoadedEnvFiles;
    isDev?: boolean;
    pages: {
        [page: string]: string;
    };
    pagesDir: string;
    previewMode: __ApiPreviewProps;
    rootDir: string;
    rootPaths?: Record<string, string>;
    target: 'server' | 'serverless' | 'experimental-serverless-trace';
    appDir?: string;
    appPaths?: Record<string, string>;
    pageExtensions: string[];
}
export declare function getEdgeServerEntry(opts: {
    absolutePagePath: string;
    buildId: string;
    bundlePath: string;
    config: NextConfigComplete;
    isDev: boolean;
    isServerComponent: boolean;
    page: string;
    pages: {
        [page: string]: string;
    };
    middleware?: {
        pathMatcher?: RegExp;
    };
}): string | {
    import: string;
    layer: string | undefined;
};
export declare function getAppEntry(opts: {
    name: string;
    pagePath: string;
    appDir: string;
    pageExtensions: string[];
}): {
    import: string;
    layer: string;
};
export declare function getServerlessEntry(opts: {
    absolutePagePath: string;
    buildId: string;
    config: NextConfigComplete;
    envFiles: LoadedEnvFiles;
    page: string;
    previewMode: __ApiPreviewProps;
    pages: {
        [page: string]: string;
    };
}): ObjectValue<webpack5.EntryObject>;
export declare function getClientEntry(opts: {
    absolutePagePath: string;
    page: string;
}): string | string[];
export declare function createEntrypoints(params: CreateEntrypointsParams): Promise<{
    client: webpack5.EntryObject;
    server: webpack5.EntryObject;
    edgeServer: webpack5.EntryObject;
    middlewareRegex: undefined;
}>;
export declare function runDependingOnPageType<T>(params: {
    onClient: () => T;
    onEdgeServer: () => T;
    onServer: () => T;
    page: string;
    pageRuntime: ServerRuntime;
}): {
    edgeServer: T;
    server?: undefined;
    client?: undefined;
} | {
    server: T;
    edgeServer?: undefined;
    client?: undefined;
} | {
    client: T;
    server: T;
    edgeServer?: undefined;
} | {
    client: T;
    edgeServer: T;
    server?: undefined;
};
export declare function finalizeEntrypoint({ name, compilerType, value, isServerComponent, appDir, }: {
    compilerType?: 'client' | 'server' | 'edge-server';
    name: string;
    value: ObjectValue<webpack5.EntryObject>;
    isServerComponent?: boolean;
    appDir?: boolean;
}): ObjectValue<webpack5.EntryObject>;
export {};
