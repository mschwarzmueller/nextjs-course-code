import { Span, SpanOptions, Tracer } from '..';
import { ProxyTracerProvider } from './ProxyTracerProvider';
/**
 * Proxy tracer provided by the proxy tracer provider
 */
export declare class ProxyTracer implements Tracer {
    private _provider;
    readonly name: string;
    readonly version?: string | undefined;
    private _delegate?;
    constructor(_provider: ProxyTracerProvider, name: string, version?: string | undefined);
    getCurrentSpan(): Span | undefined;
    startSpan(name: string, options?: SpanOptions): Span;
    withSpan<T extends (...args: unknown[]) => ReturnType<T>>(span: Span, fn: T): ReturnType<T>;
    bind<T>(target: T, span?: Span): T;
    /**
     * Try to get a tracer from the proxy tracer provider.
     * If the proxy tracer provider has no delegate, return a noop tracer.
     */
    private _getTracer;
}
//# sourceMappingURL=ProxyTracer.d.ts.map