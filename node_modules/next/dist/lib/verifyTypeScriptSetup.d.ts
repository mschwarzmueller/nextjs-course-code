import { TypeCheckResult } from './typescript/runTypeCheck';
export declare function verifyTypeScriptSetup(dir: string, intentDirs: string[], typeCheckPreflight: boolean, tsconfigPath: string, disableStaticImages: boolean, cacheDir?: string): Promise<{
    result?: TypeCheckResult;
    version: string | null;
}>;
