import { TypeCheckResult } from './typescript/runTypeCheck';
export declare function verifyTypeScriptSetup(dir: string, pagesDir: string, typeCheckPreflight: boolean): Promise<TypeCheckResult | boolean>;
