import { webpack5 } from 'next/dist/compiled/webpack/webpack';
/**
 * A getter for module build info that casts to the type it should have.
 * We also expose here types to make easier to use it.
 */
export declare function getModuleBuildInfo(webpackModule: webpack5.Module): {
    nextEdgeMiddleware?: EdgeMiddlewareMeta | undefined;
    nextEdgeApiFunction?: EdgeMiddlewareMeta | undefined;
    nextEdgeSSR?: EdgeSSRMeta | undefined;
    nextUsedEnvVars?: Set<string> | undefined;
    nextWasmMiddlewareBinding?: AssetBinding | undefined;
    nextAssetMiddlewareBinding?: AssetBinding | undefined;
    usingIndirectEval?: boolean | Set<string> | undefined;
    route?: RouteMeta | undefined;
    importLocByPath?: Map<string, any> | undefined;
};
export interface RouteMeta {
    page: string;
    absolutePagePath: string;
}
export interface EdgeMiddlewareMeta {
    page: string;
    matcherRegexp?: string;
}
export interface EdgeSSRMeta {
    isServerComponent: boolean;
    page: string;
}
export interface AssetBinding {
    filePath: string;
    name: string;
}
