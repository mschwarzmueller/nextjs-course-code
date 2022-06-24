import { ComponentType } from 'react';
import { ClientBuildManifest } from '../build/webpack/plugins/build-manifest-plugin';
declare global {
    interface Window {
        __BUILD_MANIFEST?: ClientBuildManifest;
        __BUILD_MANIFEST_CB?: Function;
    }
}
export interface LoadedEntrypointSuccess {
    component: ComponentType;
    exports: any;
}
export interface LoadedEntrypointFailure {
    error: unknown;
}
export declare type RouteEntrypoint = LoadedEntrypointSuccess | LoadedEntrypointFailure;
export interface RouteStyleSheet {
    href: string;
    content: string;
}
export interface LoadedRouteSuccess extends LoadedEntrypointSuccess {
    styles: RouteStyleSheet[];
}
export interface LoadedRouteFailure {
    error: unknown;
}
export declare type RouteLoaderEntry = LoadedRouteSuccess | LoadedRouteFailure;
export declare type Future<V> = {
    resolve: (entrypoint: V) => void;
    future: Promise<V>;
};
export interface RouteLoader {
    whenEntrypoint(route: string): Promise<RouteEntrypoint>;
    onEntrypoint(route: string, execute: () => unknown): void;
    loadRoute(route: string): Promise<RouteLoaderEntry>;
    prefetch(route: string): Promise<void>;
}
export declare function markAssetError(err: Error): Error;
export declare function isAssetError(err?: Error): boolean | undefined;
export declare function getClientBuildManifest(): Promise<ClientBuildManifest>;
declare function createRouteLoader(assetPrefix: string): RouteLoader;
export default createRouteLoader;
