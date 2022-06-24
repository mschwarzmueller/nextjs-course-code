import { IConformanceTestResult, IWebpackConformanceTest } from '../TestInterface';
export interface GranularChunksConformanceCheck extends IWebpackConformanceTest {
    granularChunksConfig: any;
}
export declare class GranularChunksConformanceCheck {
    constructor(granularChunksConfig: any);
    buildStared(options: any): IConformanceTestResult;
}
