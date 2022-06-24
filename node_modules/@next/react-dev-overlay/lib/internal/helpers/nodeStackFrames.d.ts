import { StackFrame } from 'stacktrace-parser';
export declare function getFilesystemFrame(frame: StackFrame): StackFrame;
export declare function isNodeError(error: Error): boolean;
export declare function getNodeError(error: Error): Error;
