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
exports.NOOP_TRACER = exports.NoopTracer = void 0;
var NoopSpan_1 = require("./NoopSpan");
var spancontext_utils_1 = require("./spancontext-utils");
var context_1 = require("../context/context");
/**
 * No-op implementations of {@link Tracer}.
 */
var NoopTracer = /** @class */ (function () {
    function NoopTracer() {
    }
    NoopTracer.prototype.getCurrentSpan = function () {
        return NoopSpan_1.NOOP_SPAN;
    };
    // startSpan starts a noop span.
    NoopTracer.prototype.startSpan = function (name, options, context) {
        var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
        if (root) {
            return NoopSpan_1.NOOP_SPAN;
        }
        var parentFromContext = context && context_1.getParentSpanContext(context);
        if (isSpanContext(parentFromContext) &&
            spancontext_utils_1.isSpanContextValid(parentFromContext)) {
            return new NoopSpan_1.NoopSpan(parentFromContext);
        }
        else {
            return NoopSpan_1.NOOP_SPAN;
        }
    };
    NoopTracer.prototype.withSpan = function (span, fn) {
        return fn();
    };
    NoopTracer.prototype.bind = function (target, _span) {
        return target;
    };
    return NoopTracer;
}());
exports.NoopTracer = NoopTracer;
function isSpanContext(spanContext) {
    return (typeof spanContext === 'object' &&
        typeof spanContext['spanId'] === 'string' &&
        typeof spanContext['traceId'] === 'string' &&
        typeof spanContext['traceFlags'] === 'number');
}
exports.NOOP_TRACER = new NoopTracer();
//# sourceMappingURL=NoopTracer.js.map