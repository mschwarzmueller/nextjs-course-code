import { ComponentType } from 'react';
import { RouteLoader } from './route-loader';
export declare type StyleSheetTuple = {
    href: string;
    text: string;
};
export declare type GoodPageCache = {
    page: ComponentType;
    mod: any;
    styleSheets: StyleSheetTuple[];
};
export default class PageLoader {
    private buildId;
    private assetPrefix;
    private promisedSsgManifest?;
    private promisedDevPagesManifest?;
    routeLoader: RouteLoader;
    constructor(buildId: string, assetPrefix: string);
    getPageList(): any;
    /**
     * @param {string} href the route href (file-system path)
     * @param {string} asPath the URL as shown in browser (virtual path); used for dynamic routes
     * @returns {string}
     */
    getDataHref(href: string, asPath: string, ssg: boolean, locale?: string | false): string;
    /**
     * @param {string} href the route href (file-system path)
     */
    _isSsg(href: string): Promise<boolean>;
    loadPage(route: string): Promise<GoodPageCache>;
    prefetch(route: string): Promise<void>;
}
