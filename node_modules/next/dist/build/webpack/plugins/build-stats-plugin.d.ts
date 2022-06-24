import { webpack } from 'next/dist/compiled/webpack/webpack';
export default class BuildStatsPlugin {
    private distDir;
    constructor(options: {
        distDir: string;
    });
    apply(compiler: webpack.Compiler): void;
}
