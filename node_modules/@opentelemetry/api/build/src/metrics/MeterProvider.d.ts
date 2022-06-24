import { Meter } from './Meter';
/**
 * A registry for creating named {@link Meter}s.
 */
export interface MeterProvider {
    /**
     * Returns a Meter, creating one if one with the given name and version is
     * not already created.
     *
     * @param name The name of the meter or instrumentation library.
     * @param version The version of the meter or instrumentation library.
     * @returns Meter A Meter with the given name and version
     */
    getMeter(name: string, version?: string): Meter;
}
//# sourceMappingURL=MeterProvider.d.ts.map