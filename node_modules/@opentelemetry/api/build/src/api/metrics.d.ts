import { Meter } from '../metrics/Meter';
import { MeterProvider } from '../metrics/MeterProvider';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Metrics API
 */
export declare class MetricsAPI {
    private static _instance?;
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    private constructor();
    /** Get the singleton instance of the Metrics API */
    static getInstance(): MetricsAPI;
    /**
     * Set the current global meter. Returns the initialized global meter provider.
     */
    setGlobalMeterProvider(provider: MeterProvider): MeterProvider;
    /**
     * Returns the global meter provider.
     */
    getMeterProvider(): MeterProvider;
    /**
     * Returns a meter from the global meter provider.
     */
    getMeter(name: string, version?: string): Meter;
    /** Remove the global meter provider */
    disable(): void;
}
//# sourceMappingURL=metrics.d.ts.map