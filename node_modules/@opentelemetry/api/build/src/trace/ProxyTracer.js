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
exports.ProxyTracer = void 0;
var NoopTracer_1 = require("./NoopTracer");
/**
 * Proxy tracer provided by the proxy tracer provider
 */
var ProxyTracer = /** @class */ (function () {
    function ProxyTracer(_provider, name, version) {
        this._provider = _provider;
        this.name = name;
        this.version = version;
    }
    ProxyTracer.prototype.getCurrentSpan = function () {
        return this._getTracer().getCurrentSpan();
    };
    ProxyTracer.prototype.startSpan = function (name, options) {
        return this._getTracer().startSpan(name, options);
    };
    ProxyTracer.prototype.withSpan = function (span, fn) {
        return this._getTracer().withSpan(span, fn);
    };
    ProxyTracer.prototype.bind = function (target, span) {
        return this._getTracer().bind(target, span);
    };
    /**
     * Try to get a tracer from the proxy tracer provider.
     * If the proxy tracer provider has no delegate, return a noop tracer.
     */
    ProxyTracer.prototype._getTracer = function () {
        if (this._delegate) {
            return this._delegate;
        }
        var tracer = this._provider.getDelegateTracer(this.name, this.version);
        if (!tracer) {
            return NoopTracer_1.NOOP_TRACER;
        }
        this._delegate = tracer;
        return this._delegate;
    };
    return ProxyTracer;
}());
exports.ProxyTracer = ProxyTracer;
//# sourceMappingURL=ProxyTracer.js.map