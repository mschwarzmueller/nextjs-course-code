export declare function detectDomainLocale(domainItems: Array<{
    http?: boolean;
    domain: string;
    locales?: string[];
    defaultLocale: string;
}> | undefined, hostname?: string, detectedLocale?: string): {
    http?: boolean | undefined;
    domain: string;
    locales?: string[] | undefined;
    defaultLocale: string;
} | undefined;
