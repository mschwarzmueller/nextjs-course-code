import { Header, Rewrite, Redirect } from '../../lib/load-custom-routes';
export declare type DomainLocales = Array<{
    http?: true;
    domain: string;
    locales?: string[];
    defaultLocale: string;
}>;
export declare type NextConfig = {
    [key: string]: any;
} & {
    i18n?: {
        locales: string[];
        defaultLocale: string;
        domains?: DomainLocales;
        localeDetection?: false;
    } | null;
    headers?: () => Promise<Header[]>;
    rewrites?: () => Promise<Rewrite[]>;
    redirects?: () => Promise<Redirect[]>;
    trailingSlash?: boolean;
    future: {
        strictPostcssConfiguration: boolean;
        excludeDefaultMomentLocales: boolean;
        webpack5: boolean;
    };
};
export declare function normalizeConfig(phase: string, config: any): any;
export default function loadConfig(phase: string, dir: string, customConfig?: object | null): NextConfig;
export declare function isTargetLikeServerless(target: string): boolean;
