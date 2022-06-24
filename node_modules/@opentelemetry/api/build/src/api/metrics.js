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
exports.MetricsAPI = void 0;
var NoopMeterProvider_1 = require("../metrics/NoopMeterProvider");
var global_utils_1 = require("./global-utils");
/**
 * Singleton object which represents the entry point to the OpenTelemetry Metrics API
 */
var MetricsAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function MetricsAPI() {
    }
    /** Get the singleton instance of the Metrics API */
    MetricsAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new MetricsAPI();
        }
        return this._instance;
    };
    /**
     * Set the current global meter. Returns the initialized global meter provider.
     */
    MetricsAPI.prototype.setGlobalMeterProvider = function (provider) {
        if (global_utils_1._global[global_utils_1.GLOBAL_METRICS_API_KEY]) {
            // global meter provider has already been set
            return this.getMeterProvider();
        }
        global_utils_1._global[global_utils_1.GLOBAL_METRICS_API_KEY] = global_utils_1.makeGetter(global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION, provider, NoopMeterProvider_1.NOOP_METER_PROVIDER);
        return provider;
    };
    /**
     * Returns the global meter provider.
     */
    MetricsAPI.prototype.getMeterProvider = function () {
        var _a, _b;
        return ((_b = (_a = global_utils_1._global[global_utils_1.GLOBAL_METRICS_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(global_utils_1._global, global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : NoopMeterProvider_1.NOOP_METER_PROVIDER);
    };
    /**
     * Returns a meter from the global meter provider.
     */
    MetricsAPI.prototype.getMeter = function (name, version) {
        return this.getMeterProvider().getMeter(name, version);
    };
    /** Remove the global meter provider */
    MetricsAPI.prototype.disable = function () {
        delete global_utils_1._global[global_utils_1.GLOBAL_METRICS_API_KEY];
    };
    return MetricsAPI;
}());
exports.MetricsAPI = MetricsAPI;
//# sourceMappingURL=metrics.js.map