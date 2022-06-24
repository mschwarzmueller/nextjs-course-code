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
exports.NOOP_SPAN = exports.NoopSpan = void 0;
var spancontext_utils_1 = require("./spancontext-utils");
/**
 * The NoopSpan is the default {@link Span} that is used when no Span
 * implementation is available. All operations are no-op including context
 * propagation.
 */
var NoopSpan = /** @class */ (function () {
    function NoopSpan(_spanContext) {
        if (_spanContext === void 0) { _spanContext = spancontext_utils_1.INVALID_SPAN_CONTEXT; }
        this._spanContext = _spanContext;
    }
    // Returns a SpanContext.
    NoopSpan.prototype.context = function () {
        return this._spanContext;
    };
    // By default does nothing
    NoopSpan.prototype.setAttribute = function (_key, _value) {
        return this;
    };
    // By default does nothing
    NoopSpan.prototype.setAttributes = function (_attributes) {
        return this;
    };
    // By default does nothing
    NoopSpan.prototype.addEvent = function (_name, _attributes) {
        return this;
    };
    // By default does nothing
    NoopSpan.prototype.setStatus = function (_status) {
        return this;
    };
    // By default does nothing
    NoopSpan.prototype.updateName = function (_name) {
        return this;
    };
    // By default does nothing
    NoopSpan.prototype.end = function (_endTime) { };
    // isRecording always returns false for noopSpan.
    NoopSpan.prototype.isRecording = function () {
        return false;
    };
    // By default does nothing
    NoopSpan.prototype.recordException = function (_exception, _time) { };
    return NoopSpan;
}());
exports.NoopSpan = NoopSpan;
exports.NOOP_SPAN = new NoopSpan();
//# sourceMappingURL=NoopSpan.js.map