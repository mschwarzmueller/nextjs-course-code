import { StackFrame } from 'stacktrace-parser';
export declare const TYPE_BUILD_OK = "build-ok";
export declare const TYPE_BUILD_ERROR = "build-error";
export declare const TYPE_REFFRESH = "fast-refresh";
export declare const TYPE_UNHANDLED_ERROR = "unhandled-error";
export declare const TYPE_UNHANDLED_REJECTION = "unhandled-rejection";
export declare type BuildOk = {
    type: typeof TYPE_BUILD_OK;
};
export declare type BuildError = {
    type: typeof TYPE_BUILD_ERROR;
    message: string;
};
export declare type FastRefresh = {
    type: typeof TYPE_REFFRESH;
};
export declare type UnhandledError = {
    type: typeof TYPE_UNHANDLED_ERROR;
    reason: Error;
    frames: StackFrame[];
};
export declare type UnhandledRejection = {
    type: typeof TYPE_UNHANDLED_REJECTION;
    reason: Error;
    frames: StackFrame[];
};
export declare type BusEvent = BuildOk | BuildError | FastRefresh | UnhandledError | UnhandledRejection;
export declare type BusEventHandler = (ev: BusEvent) => void;
export declare function emit(ev: BusEvent): void;
export declare function on(fn: BusEventHandler): boolean;
export declare function off(fn: BusEventHandler): boolean;
