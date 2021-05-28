import { webpack } from 'next/dist/compiled/webpack/webpack';
export default class NextJsSsrImportPlugin {
    apply(compiler: webpack.Compiler): void;
}
