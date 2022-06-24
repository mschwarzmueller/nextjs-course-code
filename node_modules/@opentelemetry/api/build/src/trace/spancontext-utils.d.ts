import { SpanContext } from './span_context';
export declare const INVALID_SPANID = "0000000000000000";
export declare const INVALID_TRACEID = "00000000000000000000000000000000";
export declare const INVALID_SPAN_CONTEXT: SpanContext;
export declare function isValidTraceId(traceId: string): boolean;
export declare function isValidSpanId(spanId: string): boolean;
/**
 * Returns true if this {@link SpanContext} is valid.
 * @return true if this {@link SpanContext} is valid.
 */
export declare function isSpanContextValid(spanContext: SpanContext): boolean;
//# sourceMappingURL=spancontext-utils.d.ts.map