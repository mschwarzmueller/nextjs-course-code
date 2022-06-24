declare type EventBuildCompleted = {
    durationInSeconds: number;
    totalPageCount: number;
    hasDunderPages: boolean;
    hasTestPages: boolean;
};
export declare function eventBuildCompleted(pagePaths: string[], event: Omit<EventBuildCompleted, 'totalPageCount' | 'hasDunderPages' | 'hasTestPages'>): {
    eventName: string;
    payload: EventBuildCompleted;
};
declare type EventBuildOptimized = {
    durationInSeconds: number;
    totalPageCount: number;
    staticPageCount: number;
    staticPropsPageCount: number;
    serverPropsPageCount: number;
    ssrPageCount: number;
    hasDunderPages: boolean;
    hasTestPages: boolean;
    hasStatic404: boolean;
    hasReportWebVitals: boolean;
    headersCount: number;
    rewritesCount: number;
    redirectsCount: number;
};
export declare function eventBuildOptimize(pagePaths: string[], event: Omit<EventBuildOptimized, 'totalPageCount' | 'hasDunderPages' | 'hasTestPages'>): {
    eventName: string;
    payload: EventBuildOptimized;
};
export {};
