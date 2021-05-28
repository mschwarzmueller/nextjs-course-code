import { Context } from '@opentelemetry/context-base';
import { Baggage, Span, SpanContext } from '../';
/**
 * Return the active span if one exists
 *
 * @param context context to get span from
 */
export declare function getActiveSpan(context: Context): Span | undefined;
/**
 * Set the active span on a context
 *
 * @param context context to use as parent
 * @param span span to set active
 */
export declare function setActiveSpan(context: Context, span: Span): Context;
/**
 * Wrap extracted span context in a NoopSpan and set as active span in a new
 * context
 *
 * @param context context to set active span on
 * @param spanContext span context to be wrapped
 */
export declare function setExtractedSpanContext(context: Context, spanContext: SpanContext): Context;
/**
 * Get the span context of the parent span if it exists,
 * or the extracted span context if there is no active
 * span.
 *
 * @param context context to get values from
 */
export declare function getParentSpanContext(context: Context): SpanContext | undefined;
/**
 * Sets value on context to indicate that instrumentation should
 * be suppressed beyond this current scope.
 *
 * @param context context to set the suppress instrumentation value on.
 */
export declare function suppressInstrumentation(context: Context): Context;
/**
 * Sets value on context to indicate that instrumentation should
 * no-longer be suppressed beyond this current scope.
 *
 * @param context context to set the suppress instrumentation value on.
 */
export declare function unsuppressInstrumentation(context: Context): Context;
/**
 * Return current suppress instrumentation value for the given context,
 * if it exists.
 *
 * @param context context check for the suppress instrumentation value.
 */
export declare function isInstrumentationSuppressed(context: Context): boolean;
/**
 * @param {Context} Context that manage all context values
 * @returns {Baggage} Extracted baggage from the context
 */
export declare function getBaggage(context: Context): Baggage | undefined;
/**
 * @param {Context} Context that manage all context values
 * @param {Baggage} baggage that will be set in the actual context
 */
export declare function setBaggage(context: Context, baggage: Baggage): Context;
//# sourceMappingURL=context.d.ts.map