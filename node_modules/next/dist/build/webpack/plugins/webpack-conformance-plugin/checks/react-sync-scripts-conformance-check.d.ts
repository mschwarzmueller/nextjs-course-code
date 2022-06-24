import { IWebpackConformanceTest, IGetAstNodeResult } from '../TestInterface';
export declare const ErrorMessage: string;
export declare const WarningMessage: string;
export declare const ErrorDescription = "";
export interface ReactSyncScriptsConformanceCheckOptions {
    AllowedSources?: String[];
}
export declare class ReactSyncScriptsConformanceCheck implements IWebpackConformanceTest {
    private allowedSources;
    constructor({ AllowedSources, }?: ReactSyncScriptsConformanceCheckOptions);
    getAstNode(): IGetAstNodeResult[];
}
