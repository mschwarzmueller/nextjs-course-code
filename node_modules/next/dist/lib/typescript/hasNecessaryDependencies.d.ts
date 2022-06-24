export declare type NecessaryDependencies = {
    resolvedTypeScript: string;
};
export declare function hasNecessaryDependencies(baseDir: string): Promise<NecessaryDependencies>;
