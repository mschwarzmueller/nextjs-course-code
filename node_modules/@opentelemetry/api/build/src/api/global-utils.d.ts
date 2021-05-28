import { ContextManager } from '@opentelemetry/context-base';
import { TextMapPropagator } from '../context/propagation/TextMapPropagator';
import { MeterProvider } from '../metrics/MeterProvider';
import { TracerProvider } from '../trace/tracer_provider';
export declare const GLOBAL_CONTEXT_MANAGER_API_KEY: unique symbol;
export declare const GLOBAL_METRICS_API_KEY: unique symbol;
export declare const GLOBAL_PROPAGATION_API_KEY: unique symbol;
export declare const GLOBAL_TRACE_API_KEY: unique symbol;
declare type Get<T> = (version: number) => T;
export declare const _global: Partial<{
    [GLOBAL_CONTEXT_MANAGER_API_KEY]: Get<ContextManager>;
    [GLOBAL_METRICS_API_KEY]: Get<MeterProvider>;
    [GLOBAL_PROPAGATION_API_KEY]: Get<TextMapPropagator>;
    [GLOBAL_TRACE_API_KEY]: Get<TracerProvider>;
}>;
/**
 * Make a function which accepts a version integer and returns the instance of an API if the version
 * is compatible, or a fallback version (usually NOOP) if it is not.
 *
 * @param requiredVersion Backwards compatibility version which is required to return the instance
 * @param instance Instance which should be returned if the required version is compatible
 * @param fallback Fallback instance, usually NOOP, which will be returned if the required version is not compatible
 */
export declare function makeGetter<T>(requiredVersion: number, instance: T, fallback: T): Get<T>;
/**
 * A number which should be incremented each time a backwards incompatible
 * change is made to the API. This number is used when an API package
 * attempts to access the global API to ensure it is getting a compatible
 * version. If the global API is not compatible with the API package
 * attempting to get it, a NOOP API implementation will be returned.
 */
export declare const API_BACKWARDS_COMPATIBILITY_VERSION = 2;
export {};
//# sourceMappingURL=global-utils.d.ts.map