export declare type EdgeSSRLoaderQuery = {
    absolute500Path: string;
    absoluteAppPath: string;
    absoluteDocumentPath: string;
    absoluteErrorPath: string;
    absolutePagePath: string;
    buildId: string;
    dev: boolean;
    isServerComponent: boolean;
    page: string;
    stringifiedConfig: string;
};
export default function edgeSSRLoader(this: any): Promise<string>;
