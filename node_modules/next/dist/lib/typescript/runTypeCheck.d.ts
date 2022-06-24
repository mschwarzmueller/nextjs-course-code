export interface TypeCheckResult {
    hasWarnings: boolean;
    warnings?: string[];
}
export declare function runTypeCheck(ts: typeof import('typescript'), baseDir: string, tsConfigPath: string): Promise<TypeCheckResult>;
