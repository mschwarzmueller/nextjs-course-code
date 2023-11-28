import type webpack from 'webpack5';
declare const nextAppLoader: webpack.LoaderDefinitionFunction<{
    name: string;
    pagePath: string;
    appDir: string;
    pageExtensions: string[];
}>;
export default nextAppLoader;
