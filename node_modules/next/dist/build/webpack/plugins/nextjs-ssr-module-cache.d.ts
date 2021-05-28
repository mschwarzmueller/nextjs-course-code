import { webpack } from 'next/dist/compiled/webpack/webpack';
export default class NextJsSsrImportPlugin {
    private options;
    constructor(options: {
        outputPath: string;
    });
    apply(compiler: webpack.Compiler): void;
}
