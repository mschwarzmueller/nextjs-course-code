import type { AppType, DocumentType, NextComponentType } from '../shared/lib/utils';
import type { PageConfig, GetStaticPaths, GetServerSideProps, GetStaticProps } from 'next/types';
import { BuildManifest } from './get-page-files';
export declare type ManifestItem = {
    id: number | string;
    files: string[];
};
export declare type ReactLoadableManifest = {
    [moduleId: string]: ManifestItem;
};
export declare type LoadComponentsReturnType = {
    Component: NextComponentType;
    pageConfig: PageConfig;
    buildManifest: BuildManifest;
    reactLoadableManifest: ReactLoadableManifest;
    serverComponentManifest?: any;
    Document: DocumentType;
    App: AppType;
    getStaticProps?: GetStaticProps;
    getStaticPaths?: GetStaticPaths;
    getServerSideProps?: GetServerSideProps;
    ComponentMod: any;
    isAppPath?: boolean;
};
export declare function loadDefaultErrorComponents(distDir: string): Promise<{
    App: any;
    Document: any;
    Component: any;
    pageConfig: {};
    buildManifest: any;
    reactLoadableManifest: {};
    ComponentMod: any;
}>;
export declare function loadComponents(distDir: string, pathname: string, serverless: boolean, hasServerComponents?: boolean, appDirEnabled?: boolean): Promise<LoadComponentsReturnType>;
