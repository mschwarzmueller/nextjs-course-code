import { webpack } from 'next/dist/compiled/webpack/webpack';
import { FontManifest } from '../../../next-server/server/font-utils';
export declare class FontStylesheetGatheringPlugin {
    compiler?: webpack.Compiler;
    gatheredStylesheets: Array<string>;
    manifestContent: FontManifest;
    private parserHandler;
    apply(compiler: webpack.Compiler): void;
}
