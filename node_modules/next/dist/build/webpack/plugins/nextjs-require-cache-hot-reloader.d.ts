import type { webpack5 } from 'next/dist/compiled/webpack/webpack';
declare type Compiler = webpack5.Compiler;
declare type WebpackPluginInstance = webpack5.WebpackPluginInstance;
export declare class NextJsRequireCacheHotReloader implements WebpackPluginInstance {
    prevAssets: any;
    hasServerComponents: boolean;
    constructor(opts: {
        hasServerComponents: boolean;
    });
    apply(compiler: Compiler): void;
}
export {};
