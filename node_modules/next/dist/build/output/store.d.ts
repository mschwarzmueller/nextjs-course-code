export declare type OutputState = {
    bootstrap: true;
    appUrl: string | null;
    bindAddr: string | null;
} | ({
    bootstrap: false;
    appUrl: string | null;
    bindAddr: string | null;
} & ({
    loading: true;
} | {
    loading: false;
    typeChecking: boolean;
    errors: string[] | null;
    warnings: string[] | null;
}));
export declare const store: import("unistore").Store<OutputState>;
