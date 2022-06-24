import { webpack } from 'next/dist/compiled/webpack/webpack';
export declare type CompilerResult = {
    errors: string[];
    warnings: string[];
};
export declare function runCompiler(config: webpack.Configuration | webpack.Configuration[]): Promise<CompilerResult>;
