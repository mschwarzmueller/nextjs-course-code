"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBaggage = exports.getBaggage = exports.isInstrumentationSuppressed = exports.unsuppressInstrumentation = exports.suppressInstrumentation = exports.getParentSpanContext = exports.setExtractedSpanContext = exports.setActiveSpan = exports.getActiveSpan = void 0;
var context_base_1 = require("@opentelemetry/context-base");
var __1 = require("../");
/**
 * Active span key
 */
var ACTIVE_SPAN_KEY = context_base_1.createContextKey('OpenTelemetry Context Key ACTIVE_SPAN');
/**
 * Shared key for indicating if instrumentation should be suppressed beyond
 * this current scope.
 */
var SUPPRESS_INSTRUMENTATION_KEY = context_base_1.createContextKey('OpenTelemetry Context Key SUPPRESS_INSTRUMENTATION');
/**
 * Baggage key
 */
var BAGGAGE_KEY = context_base_1.createContextKey('OpenTelemetry Baggage Key');
/**
 * Return the active span if one exists
 *
 * @param context context to get span from
 */
function getActiveSpan(context) {
    return context.getValue(ACTIVE_SPAN_KEY) || undefined;
}
exports.getActiveSpan = getActiveSpan;
/**
 * Set the active span on a context
 *
 * @param context context to use as parent
 * @param span span to set active
 */
function setActiveSpan(context, span) {
    return context.setValue(ACTIVE_SPAN_KEY, span);
}
exports.setActiveSpan = setActiveSpan;
/**
 * Wrap extracted span context in a NoopSpan and set as active span in a new
 * context
 *
 * @param context context to set active span on
 * @param spanContext span context to be wrapped
 */
function setExtractedSpanContext(context, spanContext) {
    return setActiveSpan(context, new __1.NoopSpan(spanContext));
}
exports.setExtractedSpanContext = setExtractedSpanContext;
/**
 * Get the span context of the parent span if it exists,
 * or the extracted span context if there is no active
 * span.
 *
 * @param context context to get values from
 */
function getParentSpanContext(context) {
    var _a;
    return (_a = getActiveSpan(context)) === null || _a === void 0 ? void 0 : _a.context();
}
exports.getParentSpanContext = getParentSpanContext;
/**
 * Sets value on context to indicate that instrumentation should
 * be suppressed beyond this current scope.
 *
 * @param context context to set the suppress instrumentation value on.
 */
function suppressInstrumentation(context) {
    return context.setValue(SUPPRESS_INSTRUMENTATION_KEY, true);
}
exports.suppressInstrumentation = suppressInstrumentation;
/**
 * Sets value on context to indicate that instrumentation should
 * no-longer be suppressed beyond this current scope.
 *
 * @param context context to set the suppress instrumentation value on.
 */
function unsuppressInstrumentation(context) {
    return context.setValue(SUPPRESS_INSTRUMENTATION_KEY, false);
}
exports.unsuppressInstrumentation = unsuppressInstrumentation;
/**
 * Return current suppress instrumentation value for the given context,
 * if it exists.
 *
 * @param context context check for the suppress instrumentation value.
 */
function isInstrumentationSuppressed(context) {
    return Boolean(context.getValue(SUPPRESS_INSTRUMENTATION_KEY));
}
exports.isInstrumentationSuppressed = isInstrumentationSuppressed;
/**
 * @param {Context} Context that manage all context values
 * @returns {Baggage} Extracted baggage from the context
 */
function getBaggage(context) {
    return context.getValue(BAGGAGE_KEY) || undefined;
}
exports.getBaggage = getBaggage;
/**
 * @param {Context} Context that manage all context values
 * @param {Baggage} baggage that will be set in the actual context
 */
function setBaggage(context, baggage) {
    return context.setValue(BAGGAGE_KEY, baggage);
}
exports.setBaggage = setBaggage;
//# sourceMappingURL=context.js.map