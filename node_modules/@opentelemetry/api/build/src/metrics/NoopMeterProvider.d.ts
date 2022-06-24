import { Meter } from './Meter';
import { MeterProvider } from './MeterProvider';
/**
 * An implementation of the {@link MeterProvider} which returns an impotent Meter
 * for all calls to `getMeter`
 */
export declare class NoopMeterProvider implements MeterProvider {
    getMeter(_name?: string, _version?: string): Meter;
}
export declare const NOOP_METER_PROVIDER: NoopMeterProvider;
//# sourceMappingURL=NoopMeterProvider.d.ts.map