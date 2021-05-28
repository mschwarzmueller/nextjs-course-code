import { webpack } from 'next/dist/compiled/webpack/webpack';
import { Rewrite } from '../../../lib/load-custom-routes';
export declare type ClientBuildManifest = Record<string, string[]>;
export default class BuildManifestPlugin {
    private buildId;
    private rewrites;
    constructor(options: {
        buildId: string;
        rewrites: Rewrite[];
    });
    createAssets(compiler: any, compilation: any, assets: any): any;
    apply(compiler: webpack.Compiler): void;
}
