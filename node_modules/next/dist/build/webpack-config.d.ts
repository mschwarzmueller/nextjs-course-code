import { webpack } from 'next/dist/compiled/webpack/webpack';
import { Rewrite } from '../lib/load-custom-routes';
import { WebpackEntrypoints } from './entries';
import { NextConfig } from '../next-server/server/config';
export declare function attachReactRefresh(webpackConfig: webpack.Configuration, targetLoader: webpack.RuleSetUseItem): void;
export default function getBaseWebpackConfig(dir: string, { buildId, config, dev, isServer, pagesDir, target, reactProductionProfiling, entrypoints, rewrites, }: {
    buildId: string;
    config: NextConfig;
    dev?: boolean;
    isServer?: boolean;
    pagesDir: string;
    target?: string;
    reactProductionProfiling?: boolean;
    entrypoints: WebpackEntrypoints;
    rewrites: Rewrite[];
}): Promise<webpack.Configuration>;
