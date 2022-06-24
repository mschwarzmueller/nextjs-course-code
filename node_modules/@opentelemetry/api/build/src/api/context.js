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
exports.ContextAPI = void 0;
var context_base_1 = require("@opentelemetry/context-base");
var global_utils_1 = require("./global-utils");
var NOOP_CONTEXT_MANAGER = new context_base_1.NoopContextManager();
/**
 * Singleton object which represents the entry point to the OpenTelemetry Context API
 */
var ContextAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function ContextAPI() {
    }
    /** Get the singleton instance of the Context API */
    ContextAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new ContextAPI();
        }
        return this._instance;
    };
    /**
     * Set the current context manager. Returns the initialized context manager
     */
    ContextAPI.prototype.setGlobalContextManager = function (contextManager) {
        if (global_utils_1._global[global_utils_1.GLOBAL_CONTEXT_MANAGER_API_KEY]) {
            // global context manager has already been set
            return this._getContextManager();
        }
        global_utils_1._global[global_utils_1.GLOBAL_CONTEXT_MANAGER_API_KEY] = global_utils_1.makeGetter(global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION, contextManager, NOOP_CONTEXT_MANAGER);
        return contextManager;
    };
    /**
     * Get the currently active context
     */
    ContextAPI.prototype.active = function () {
        return this._getContextManager().active();
    };
    /**
     * Execute a function with an active context
     *
     * @param context context to be active during function execution
     * @param fn function to execute in a context
     */
    ContextAPI.prototype.with = function (context, fn) {
        return this._getContextManager().with(context, fn);
    };
    /**
     * Bind a context to a target function or event emitter
     *
     * @param target function or event emitter to bind
     * @param context context to bind to the event emitter or function. Defaults to the currently active context
     */
    ContextAPI.prototype.bind = function (target, context) {
        if (context === void 0) { context = this.active(); }
        return this._getContextManager().bind(target, context);
    };
    ContextAPI.prototype._getContextManager = function () {
        var _a, _b;
        return ((_b = (_a = global_utils_1._global[global_utils_1.GLOBAL_CONTEXT_MANAGER_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(global_utils_1._global, global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : NOOP_CONTEXT_MANAGER);
    };
    /** Disable and remove the global context manager */
    ContextAPI.prototype.disable = function () {
        this._getContextManager().disable();
        delete global_utils_1._global[global_utils_1.GLOBAL_CONTEXT_MANAGER_API_KEY];
    };
    return ContextAPI;
}());
exports.ContextAPI = ContextAPI;
//# sourceMappingURL=context.js.map