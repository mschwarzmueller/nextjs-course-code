import { IGetAstNodeResult, IWebpackConformanceTest } from '../TestInterface';
export interface DuplicatePolyfillsConformanceTestSettings {
    BlockedAPIToBePolyfilled?: string[];
}
export declare class DuplicatePolyfillsConformanceCheck implements IWebpackConformanceTest {
    private BlockedAPIs;
    constructor(options?: DuplicatePolyfillsConformanceTestSettings);
    getAstNode(): IGetAstNodeResult[];
}
