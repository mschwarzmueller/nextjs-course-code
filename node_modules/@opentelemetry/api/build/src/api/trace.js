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
exports.TraceAPI = void 0;
var NoopTracerProvider_1 = require("../trace/NoopTracerProvider");
var ProxyTracerProvider_1 = require("../trace/ProxyTracerProvider");
var spancontext_utils_1 = require("../trace/spancontext-utils");
var global_utils_1 = require("./global-utils");
/**
 * Singleton object which represents the entry point to the OpenTelemetry Tracing API
 */
var TraceAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function TraceAPI() {
        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
        this.isSpanContextValid = spancontext_utils_1.isSpanContextValid;
    }
    /** Get the singleton instance of the Trace API */
    TraceAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new TraceAPI();
        }
        return this._instance;
    };
    /**
     * Set the current global tracer. Returns the initialized global tracer provider
     */
    TraceAPI.prototype.setGlobalTracerProvider = function (provider) {
        if (global_utils_1._global[global_utils_1.GLOBAL_TRACE_API_KEY]) {
            // global tracer provider has already been set
            return this.getTracerProvider();
        }
        this._proxyTracerProvider.setDelegate(provider);
        global_utils_1._global[global_utils_1.GLOBAL_TRACE_API_KEY] = global_utils_1.makeGetter(global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION, this._proxyTracerProvider, NoopTracerProvider_1.NOOP_TRACER_PROVIDER);
        return this.getTracerProvider();
    };
    /**
     * Returns the global tracer provider.
     */
    TraceAPI.prototype.getTracerProvider = function () {
        var _a, _b;
        return ((_b = (_a = global_utils_1._global[global_utils_1.GLOBAL_TRACE_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(global_utils_1._global, global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : this._proxyTracerProvider);
    };
    /**
     * Returns a tracer from the global tracer provider.
     */
    TraceAPI.prototype.getTracer = function (name, version) {
        return this.getTracerProvider().getTracer(name, version);
    };
    /** Remove the global tracer provider */
    TraceAPI.prototype.disable = function () {
        delete global_utils_1._global[global_utils_1.GLOBAL_TRACE_API_KEY];
        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
    };
    return TraceAPI;
}());
exports.TraceAPI = TraceAPI;
//# sourceMappingURL=trace.js.map