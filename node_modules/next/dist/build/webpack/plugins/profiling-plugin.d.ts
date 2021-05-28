import { Span } from '@opentelemetry/api';
export declare const spans: WeakMap<object, any>;
export declare class ProfilingPlugin {
    compiler: any;
    apply(compiler: any): void;
    traceHookPair(spanName: string, startHook: any, stopHook: any, attrs?: any, onSetSpan?: (span: Span | undefined) => void): void;
    traceLoopedHook(spanName: string, startHook: any, stopHook: any): void;
    traceTopLevelHooks(compiler: any): void;
    traceCompilationHooks(compiler: any): void;
}
