import { Compiler as WebpackCompiler, Template as WebpackTemplate, RuntimeModule as WebpackRuntimeModule, RuntimeGlobals as WebpackRuntimeGlobals } from 'webpack';
declare class ReactFreshWebpackPlugin {
    webpackMajorVersion: number;
    RuntimeGlobals: typeof WebpackRuntimeGlobals;
    RuntimeModule: typeof WebpackRuntimeModule;
    Template: typeof WebpackTemplate;
    constructor({ version, RuntimeGlobals, RuntimeModule, Template }?: any);
    apply(compiler: WebpackCompiler): void;
}
export default ReactFreshWebpackPlugin;
