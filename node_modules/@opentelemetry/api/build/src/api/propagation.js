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
exports.PropagationAPI = void 0;
var NoopTextMapPropagator_1 = require("../context/propagation/NoopTextMapPropagator");
var TextMapPropagator_1 = require("../context/propagation/TextMapPropagator");
var global_utils_1 = require("./global-utils");
/**
 * Singleton object which represents the entry point to the OpenTelemetry Propagation API
 */
var PropagationAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function PropagationAPI() {
    }
    /** Get the singleton instance of the Propagator API */
    PropagationAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new PropagationAPI();
        }
        return this._instance;
    };
    /**
     * Set the current propagator. Returns the initialized propagator
     */
    PropagationAPI.prototype.setGlobalPropagator = function (propagator) {
        if (global_utils_1._global[global_utils_1.GLOBAL_PROPAGATION_API_KEY]) {
            // global propagator has already been set
            return this._getGlobalPropagator();
        }
        global_utils_1._global[global_utils_1.GLOBAL_PROPAGATION_API_KEY] = global_utils_1.makeGetter(global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION, propagator, NoopTextMapPropagator_1.NOOP_TEXT_MAP_PROPAGATOR);
        return propagator;
    };
    /**
     * Inject context into a carrier to be propagated inter-process
     *
     * @param context Context carrying tracing data to inject
     * @param carrier carrier to inject context into
     * @param setter Function used to set values on the carrier
     */
    PropagationAPI.prototype.inject = function (context, carrier, setter) {
        if (setter === void 0) { setter = TextMapPropagator_1.defaultTextMapSetter; }
        return this._getGlobalPropagator().inject(context, carrier, setter);
    };
    /**
     * Extract context from a carrier
     *
     * @param context Context which the newly created context will inherit from
     * @param carrier Carrier to extract context from
     * @param getter Function used to extract keys from a carrier
     */
    PropagationAPI.prototype.extract = function (context, carrier, getter) {
        if (getter === void 0) { getter = TextMapPropagator_1.defaultTextMapGetter; }
        return this._getGlobalPropagator().extract(context, carrier, getter);
    };
    /** Remove the global propagator */
    PropagationAPI.prototype.disable = function () {
        delete global_utils_1._global[global_utils_1.GLOBAL_PROPAGATION_API_KEY];
    };
    PropagationAPI.prototype._getGlobalPropagator = function () {
        var _a, _b;
        return ((_b = (_a = global_utils_1._global[global_utils_1.GLOBAL_PROPAGATION_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(global_utils_1._global, global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : NoopTextMapPropagator_1.NOOP_TEXT_MAP_PROPAGATOR);
    };
    return PropagationAPI;
}());
exports.PropagationAPI = PropagationAPI;
//# sourceMappingURL=propagation.js.map