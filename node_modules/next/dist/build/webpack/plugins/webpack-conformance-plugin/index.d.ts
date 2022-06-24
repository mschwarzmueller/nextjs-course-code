import { webpack } from 'next/dist/compiled/webpack/webpack';
import { IWebpackConformanceTest } from './TestInterface';
export { DuplicatePolyfillsConformanceCheck } from './checks/duplicate-polyfills-conformance-check';
export { GranularChunksConformanceCheck } from './checks/granular-chunks-conformance';
export { MinificationConformanceCheck } from './checks/minification-conformance-check';
export { ReactSyncScriptsConformanceCheck } from './checks/react-sync-scripts-conformance-check';
export interface IWebpackConformancePluginOptions {
    tests: IWebpackConformanceTest[];
}
export default class WebpackConformancePlugin {
    private tests;
    private errors;
    private warnings;
    private compiler?;
    constructor(options: IWebpackConformancePluginOptions);
    private gatherResults;
    private buildStartedHandler;
    private buildCompletedHandler;
    private parserHandler;
    apply(compiler: webpack.Compiler): void;
}
