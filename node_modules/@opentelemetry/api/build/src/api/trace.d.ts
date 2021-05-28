import { Tracer } from '../trace/tracer';
import { TracerProvider } from '../trace/tracer_provider';
import { isSpanContextValid } from '../trace/spancontext-utils';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Tracing API
 */
export declare class TraceAPI {
    private static _instance?;
    private _proxyTracerProvider;
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    private constructor();
    /** Get the singleton instance of the Trace API */
    static getInstance(): TraceAPI;
    /**
     * Set the current global tracer. Returns the initialized global tracer provider
     */
    setGlobalTracerProvider(provider: TracerProvider): TracerProvider;
    /**
     * Returns the global tracer provider.
     */
    getTracerProvider(): TracerProvider;
    /**
     * Returns a tracer from the global tracer provider.
     */
    getTracer(name: string, version?: string): Tracer;
    /** Remove the global tracer provider */
    disable(): void;
    isSpanContextValid: typeof isSpanContextValid;
}
//# sourceMappingURL=trace.d.ts.map