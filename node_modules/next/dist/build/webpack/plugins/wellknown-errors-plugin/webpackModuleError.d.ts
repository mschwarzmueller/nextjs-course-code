import { webpack } from 'next/dist/compiled/webpack/webpack';
import { SimpleWebpackError } from './simpleWebpackError';
export declare function getModuleBuildError(compilation: webpack.compilation.Compilation, input: any): Promise<SimpleWebpackError | false>;
