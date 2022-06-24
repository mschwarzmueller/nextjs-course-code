export declare type LogFunction = (message: string, ...args: unknown[]) => void;
/** Defines a logger interface. */
export interface Logger {
    error: LogFunction;
    warn: LogFunction;
    info: LogFunction;
    debug: LogFunction;
}
//# sourceMappingURL=Logger.d.ts.map