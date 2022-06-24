import { StackFrame } from 'stacktrace-parser';
export declare type OriginalStackFrame = {
    error: true;
    reason: string;
    external: false;
    expanded: false;
    sourceStackFrame: StackFrame;
    originalStackFrame: null;
    originalCodeFrame: null;
} | {
    error: false;
    reason: null;
    external: false;
    expanded: boolean;
    sourceStackFrame: StackFrame;
    originalStackFrame: StackFrame;
    originalCodeFrame: string | null;
} | {
    error: false;
    reason: null;
    external: true;
    expanded: false;
    sourceStackFrame: StackFrame;
    originalStackFrame: null;
    originalCodeFrame: null;
};
export declare function getOriginalStackFrames(isServerSide: boolean, frames: StackFrame[]): Promise<OriginalStackFrame[]>;
export declare function getOriginalStackFrame(isServerSide: boolean, source: StackFrame): Promise<OriginalStackFrame>;
export declare function getFrameSource(frame: StackFrame): string;
