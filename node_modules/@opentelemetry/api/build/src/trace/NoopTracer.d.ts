import { Span, SpanOptions, Tracer } from '..';
import { Context } from '@opentelemetry/context-base';
/**
 * No-op implementations of {@link Tracer}.
 */
export declare class NoopTracer implements Tracer {
    getCurrentSpan(): Span;
    startSpan(name: string, options?: SpanOptions, context?: Context): Span;
    withSpan<T extends (...args: unknown[]) => ReturnType<T>>(span: Span, fn: T): ReturnType<T>;
    bind<T>(target: T, _span?: Span): T;
}
export declare const NOOP_TRACER: NoopTracer;
//# sourceMappingURL=NoopTracer.d.ts.map