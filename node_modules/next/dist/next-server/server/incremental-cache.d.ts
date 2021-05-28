/// <reference types="lru-cache" />
import LRUCache from 'next/dist/compiled/lru-cache';
import { PrerenderManifest } from '../../build';
declare type IncrementalCacheValue = {
    html?: string;
    pageData?: any;
    isStale?: boolean;
    isNotFound?: boolean;
    isRedirect?: boolean;
    curRevalidate?: number | false;
    revalidateAfter: number | false;
};
export declare class IncrementalCache {
    incrementalOptions: {
        flushToDisk?: boolean;
        pagesDir?: string;
        distDir?: string;
        dev?: boolean;
    };
    prerenderManifest: PrerenderManifest;
    cache: LRUCache<string, IncrementalCacheValue>;
    locales?: string[];
    constructor({ max, dev, distDir, pagesDir, flushToDisk, locales, }: {
        dev: boolean;
        max?: number;
        distDir: string;
        pagesDir: string;
        flushToDisk?: boolean;
        locales?: string[];
    });
    private getSeedPath;
    private calculateRevalidate;
    getFallback(page: string): Promise<string>;
    get(pathname: string): Promise<IncrementalCacheValue | void>;
    set(pathname: string, data: {
        html?: string;
        pageData?: any;
        isNotFound?: boolean;
        isRedirect?: boolean;
    }, revalidateSeconds?: number | false): Promise<void>;
}
export {};
