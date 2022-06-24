import { NextConfig } from '../next-server/server/config';
export declare type Rewrite = {
    source: string;
    destination: string;
    basePath?: false;
    locale?: false;
};
export declare type Header = {
    source: string;
    basePath?: false;
    locale?: false;
    headers: Array<{
        key: string;
        value: string;
    }>;
};
export declare type Redirect = Rewrite & {
    statusCode?: number;
    permanent?: boolean;
};
export declare const allowedStatusCodes: Set<number>;
export declare function getRedirectStatus(route: {
    statusCode?: number;
    permanent?: boolean;
}): number;
export declare function normalizeRouteRegex(regex: string): string;
export declare type RouteType = 'rewrite' | 'redirect' | 'header';
export interface CustomRoutes {
    headers: Header[];
    rewrites: Rewrite[];
    redirects: Redirect[];
}
export default function loadCustomRoutes(config: NextConfig): Promise<CustomRoutes>;
