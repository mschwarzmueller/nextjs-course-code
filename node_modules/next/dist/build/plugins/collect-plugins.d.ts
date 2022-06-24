export declare type PluginMetaData = {
    requiredEnv: string[];
    middleware: string[];
    pluginName: string;
    directory: string;
    pkgName: string;
    version: string;
    config?: {
        [name: string]: any;
    };
};
export declare const VALID_MIDDLEWARE: string[];
declare type ENV_OPTIONS = {
    [name: string]: string;
};
export declare const getPluginId: (pkg: string) => string;
declare type PluginConfig = string | {
    name: string;
    config: {
        [name: string]: any;
    };
};
declare function _collectPlugins(dir: string, env: ENV_OPTIONS, pluginsConfig: PluginConfig[] | undefined): Promise<PluginMetaData[]>;
export declare const collectPlugins: typeof _collectPlugins;
export {};
