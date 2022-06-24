import { Context } from '@opentelemetry/context-base';
import { TextMapGetter, TextMapPropagator, TextMapSetter } from '../context/propagation/TextMapPropagator';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Propagation API
 */
export declare class PropagationAPI {
    private static _instance?;
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    private constructor();
    /** Get the singleton instance of the Propagator API */
    static getInstance(): PropagationAPI;
    /**
     * Set the current propagator. Returns the initialized propagator
     */
    setGlobalPropagator(propagator: TextMapPropagator): TextMapPropagator;
    /**
     * Inject context into a carrier to be propagated inter-process
     *
     * @param context Context carrying tracing data to inject
     * @param carrier carrier to inject context into
     * @param setter Function used to set values on the carrier
     */
    inject<Carrier>(context: Context, carrier: Carrier, setter?: TextMapSetter<Carrier>): void;
    /**
     * Extract context from a carrier
     *
     * @param context Context which the newly created context will inherit from
     * @param carrier Carrier to extract context from
     * @param getter Function used to extract keys from a carrier
     */
    extract<Carrier>(context: Context, carrier: Carrier, getter?: TextMapGetter<Carrier>): Context;
    /** Remove the global propagator */
    disable(): void;
    private _getGlobalPropagator;
}
//# sourceMappingURL=propagation.d.ts.map