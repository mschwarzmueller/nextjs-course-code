export declare type TypeScriptIntent = {
    firstTimeSetup: boolean;
};
export declare function getTypeScriptIntent(baseDir: string, pagesDir: string): Promise<TypeScriptIntent | false>;
