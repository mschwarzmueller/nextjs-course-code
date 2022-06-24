/// <reference types="react" />
import { BuildManifest } from './get-page-files';
import { AppType, DocumentType } from '../lib/utils';
import { PageConfig, GetStaticPaths, GetServerSideProps, GetStaticProps } from 'next/types';
export declare function interopDefault(mod: any): any;
export declare type ManifestItem = {
    id: number | string;
    name: string;
    file: string;
};
declare type ReactLoadableManifest = {
    [moduleId: string]: ManifestItem[];
};
export declare type LoadComponentsReturnType = {
    Component: React.ComponentType;
    pageConfig?: PageConfig;
    buildManifest: BuildManifest;
    reactLoadableManifest: ReactLoadableManifest;
    Document: DocumentType;
    App: AppType;
    getStaticProps?: GetStaticProps;
    getStaticPaths?: GetStaticPaths;
    getServerSideProps?: GetServerSideProps;
};
export declare function loadComponents(distDir: string, pathname: string, serverless: boolean): Promise<LoadComponentsReturnType>;
export {};
