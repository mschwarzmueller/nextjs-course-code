import { webpack } from 'next/dist/compiled/webpack/webpack';
export declare class NextJsRequireCacheHotReloader implements webpack.Plugin {
    prevAssets: any;
    previousOutputPathsWebpack5: Set<string>;
    currentOutputPathsWebpack5: Set<string>;
    apply(compiler: webpack.Compiler): void;
}
