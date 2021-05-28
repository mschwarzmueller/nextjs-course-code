import { webpack } from 'next/dist/compiled/webpack/webpack';
import { PluginMetaData } from '../../plugins/collect-plugins';
export declare type NextPluginLoaderQuery = {
    middleware: string;
};
export declare const pluginLoaderOptions: {
    plugins: PluginMetaData[];
};
declare const nextPluginLoader: webpack.loader.Loader;
export default nextPluginLoader;
