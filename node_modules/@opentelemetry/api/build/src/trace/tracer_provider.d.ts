import { Tracer } from './tracer';
/**
 * A registry for creating named {@link Tracer}s.
 */
export interface TracerProvider {
    /**
     * Returns a Tracer, creating one if one with the given name and version is
     * not already created.
     *
     * This function may return different Tracer types (e.g.
     * {@link NoopTracerProvider} vs. a functional tracer).
     *
     * @param name The name of the tracer or instrumentation library.
     * @param version The version of the tracer or instrumentation library.
     * @returns Tracer A Tracer with the given name and version
     */
    getTracer(name: string, version?: string): Tracer;
}
//# sourceMappingURL=tracer_provider.d.ts.map