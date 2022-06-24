export * from './common/Exception';
export * from './common/Logger';
export * from './common/Time';
export * from './context/context';
export * from './context/propagation/TextMapPropagator';
export * from './context/propagation/NoopTextMapPropagator';
export * from './baggage/Baggage';
export * from './baggage/EntryValue';
export * from './metrics/BatchObserverResult';
export * from './metrics/BoundInstrument';
export * from './metrics/Meter';
export * from './metrics/MeterProvider';
export * from './metrics/Metric';
export * from './metrics/NoopMeter';
export * from './metrics/NoopMeterProvider';
export * from './metrics/Observation';
export * from './metrics/ObserverResult';
export * from './trace/attributes';
export * from './trace/Event';
export * from './trace/link_context';
export * from './trace/link';
export * from './trace/NoopLogger';
export * from './trace/NoopSpan';
export * from './trace/NoopTracer';
export * from './trace/NoopTracerProvider';
export * from './trace/ProxyTracer';
export * from './trace/ProxyTracerProvider';
export * from './trace/Sampler';
export * from './trace/SamplingResult';
export * from './trace/span_context';
export * from './trace/span_kind';
export * from './trace/span';
export * from './trace/SpanOptions';
export * from './trace/status';
export * from './trace/TimedEvent';
export * from './trace/trace_flags';
export * from './trace/trace_state';
export * from './trace/tracer_provider';
export * from './trace/tracer';
export { INVALID_SPANID, INVALID_TRACEID, INVALID_SPAN_CONTEXT, isSpanContextValid, isValidTraceId, isValidSpanId, } from './trace/spancontext-utils';
export { Context, ROOT_CONTEXT, createContextKey, ContextManager, } from '@opentelemetry/context-base';
import { ContextAPI } from './api/context';
/** Entrypoint for context API */
export declare const context: ContextAPI;
import { TraceAPI } from './api/trace';
/** Entrypoint for trace API */
export declare const trace: TraceAPI;
import { MetricsAPI } from './api/metrics';
/** Entrypoint for metrics API */
export declare const metrics: MetricsAPI;
import { PropagationAPI } from './api/propagation';
/** Entrypoint for propagation API */
export declare const propagation: PropagationAPI;
declare const _default: {
    trace: TraceAPI;
    metrics: MetricsAPI;
    context: ContextAPI;
    propagation: PropagationAPI;
};
export default _default;
//# sourceMappingURL=index.d.ts.map