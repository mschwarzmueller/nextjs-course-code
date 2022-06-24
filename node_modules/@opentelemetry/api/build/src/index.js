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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propagation = exports.metrics = exports.trace = exports.context = void 0;
__exportStar(require("./common/Exception"), exports);
__exportStar(require("./common/Logger"), exports);
__exportStar(require("./common/Time"), exports);
__exportStar(require("./context/context"), exports);
__exportStar(require("./context/propagation/TextMapPropagator"), exports);
__exportStar(require("./context/propagation/NoopTextMapPropagator"), exports);
__exportStar(require("./baggage/Baggage"), exports);
__exportStar(require("./baggage/EntryValue"), exports);
__exportStar(require("./metrics/BatchObserverResult"), exports);
__exportStar(require("./metrics/BoundInstrument"), exports);
__exportStar(require("./metrics/Meter"), exports);
__exportStar(require("./metrics/MeterProvider"), exports);
__exportStar(require("./metrics/Metric"), exports);
__exportStar(require("./metrics/NoopMeter"), exports);
__exportStar(require("./metrics/NoopMeterProvider"), exports);
__exportStar(require("./metrics/Observation"), exports);
__exportStar(require("./metrics/ObserverResult"), exports);
__exportStar(require("./trace/attributes"), exports);
__exportStar(require("./trace/Event"), exports);
__exportStar(require("./trace/link_context"), exports);
__exportStar(require("./trace/link"), exports);
__exportStar(require("./trace/NoopLogger"), exports);
__exportStar(require("./trace/NoopSpan"), exports);
__exportStar(require("./trace/NoopTracer"), exports);
__exportStar(require("./trace/NoopTracerProvider"), exports);
__exportStar(require("./trace/ProxyTracer"), exports);
__exportStar(require("./trace/ProxyTracerProvider"), exports);
__exportStar(require("./trace/Sampler"), exports);
__exportStar(require("./trace/SamplingResult"), exports);
__exportStar(require("./trace/span_context"), exports);
__exportStar(require("./trace/span_kind"), exports);
__exportStar(require("./trace/span"), exports);
__exportStar(require("./trace/SpanOptions"), exports);
__exportStar(require("./trace/status"), exports);
__exportStar(require("./trace/TimedEvent"), exports);
__exportStar(require("./trace/trace_flags"), exports);
__exportStar(require("./trace/trace_state"), exports);
__exportStar(require("./trace/tracer_provider"), exports);
__exportStar(require("./trace/tracer"), exports);
var spancontext_utils_1 = require("./trace/spancontext-utils");
Object.defineProperty(exports, "INVALID_SPANID", { enumerable: true, get: function () { return spancontext_utils_1.INVALID_SPANID; } });
Object.defineProperty(exports, "INVALID_TRACEID", { enumerable: true, get: function () { return spancontext_utils_1.INVALID_TRACEID; } });
Object.defineProperty(exports, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function () { return spancontext_utils_1.INVALID_SPAN_CONTEXT; } });
Object.defineProperty(exports, "isSpanContextValid", { enumerable: true, get: function () { return spancontext_utils_1.isSpanContextValid; } });
Object.defineProperty(exports, "isValidTraceId", { enumerable: true, get: function () { return spancontext_utils_1.isValidTraceId; } });
Object.defineProperty(exports, "isValidSpanId", { enumerable: true, get: function () { return spancontext_utils_1.isValidSpanId; } });
var context_base_1 = require("@opentelemetry/context-base");
Object.defineProperty(exports, "ROOT_CONTEXT", { enumerable: true, get: function () { return context_base_1.ROOT_CONTEXT; } });
Object.defineProperty(exports, "createContextKey", { enumerable: true, get: function () { return context_base_1.createContextKey; } });
var context_1 = require("./api/context");
/** Entrypoint for context API */
exports.context = context_1.ContextAPI.getInstance();
var trace_1 = require("./api/trace");
/** Entrypoint for trace API */
exports.trace = trace_1.TraceAPI.getInstance();
var metrics_1 = require("./api/metrics");
/** Entrypoint for metrics API */
exports.metrics = metrics_1.MetricsAPI.getInstance();
var propagation_1 = require("./api/propagation");
/** Entrypoint for propagation API */
exports.propagation = propagation_1.PropagationAPI.getInstance();
exports.default = {
    trace: exports.trace,
    metrics: exports.metrics,
    context: exports.context,
    propagation: exports.propagation,
};
//# sourceMappingURL=index.js.map