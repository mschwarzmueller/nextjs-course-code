import AmpHtmlValidator from 'next/dist/compiled/amphtml-validator';
import 'next/dist/next-server/server/node-polyfill-fetch';
import { FontManifest } from '../next-server/server/font-utils';
interface AmpValidation {
    page: string;
    result: {
        errors: AmpHtmlValidator.ValidationError[];
        warnings: AmpHtmlValidator.ValidationError[];
    };
}
interface PathMap {
    page: string;
    query?: {
        [key: string]: string | string[];
    };
}
interface ExportPageInput {
    path: string;
    pathMap: PathMap;
    distDir: string;
    outDir: string;
    pagesDataDir: string;
    renderOpts: RenderOpts;
    buildExport?: boolean;
    serverRuntimeConfig: string;
    subFolders?: boolean;
    serverless: boolean;
    optimizeFonts: boolean;
    optimizeImages: boolean;
    optimizeCss: any;
    spanContext: any;
}
interface ExportPageResults {
    ampValidations: AmpValidation[];
    fromBuildExportRevalidate?: number;
    error?: boolean;
    ssgNotFound?: boolean;
}
interface RenderOpts {
    runtimeConfig?: {
        [key: string]: any;
    };
    params?: {
        [key: string]: string | string[];
    };
    ampPath?: string;
    ampValidatorPath?: string;
    ampSkipValidation?: boolean;
    hybridAmp?: boolean;
    inAmpMode?: boolean;
    optimizeFonts?: boolean;
    optimizeImages?: boolean;
    optimizeCss?: any;
    fontManifest?: FontManifest;
    locales?: string[];
    locale?: string;
    defaultLocale?: string;
}
export default function exportPage({ spanContext, path, pathMap, distDir, outDir, pagesDataDir, renderOpts, buildExport, serverRuntimeConfig, subFolders, serverless, optimizeFonts, optimizeImages, optimizeCss, }: ExportPageInput): Promise<ExportPageResults>;
export {};
