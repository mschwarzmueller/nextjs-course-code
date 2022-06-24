export declare function recursiveCopy(source: string, dest: string, { concurrency, overwrite, filter, }?: {
    concurrency?: number;
    overwrite?: boolean;
    filter?(path: string): boolean;
}): Promise<void>;
