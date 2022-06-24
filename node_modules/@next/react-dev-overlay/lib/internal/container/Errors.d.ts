import * as React from 'react';
import { UnhandledError, UnhandledRejection } from '../bus';
import { OriginalStackFrame } from '../helpers/stack-frame';
export declare type SupportedErrorEvent = {
    id: number;
    event: UnhandledError | UnhandledRejection;
};
export declare type ErrorsProps = {
    errors: SupportedErrorEvent[];
};
export declare type ReadyRuntimeError = {
    id: number;
    runtime: true;
    error: Error;
    frames: OriginalStackFrame[];
};
export declare const Errors: React.FC<ErrorsProps>;
export declare const styles: string;
