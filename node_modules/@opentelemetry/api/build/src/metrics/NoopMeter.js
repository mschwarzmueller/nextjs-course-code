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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOOP_BATCH_OBSERVER = exports.NOOP_SUM_OBSERVER_METRIC = exports.NOOP_UP_DOWN_SUM_OBSERVER_METRIC = exports.NOOP_VALUE_OBSERVER_METRIC = exports.NOOP_BOUND_BASE_OBSERVER = exports.NOOP_VALUE_RECORDER_METRIC = exports.NOOP_BOUND_VALUE_RECORDER = exports.NOOP_COUNTER_METRIC = exports.NOOP_BOUND_COUNTER = exports.NOOP_METER = exports.NoopBoundBaseObserver = exports.NoopBoundValueRecorder = exports.NoopBoundCounter = exports.NoopBatchObserver = exports.NoopBaseObserverMetric = exports.NoopValueRecorderMetric = exports.NoopCounterMetric = exports.NoopMetric = exports.NoopMeter = void 0;
/**
 * NoopMeter is a noop implementation of the {@link Meter} interface. It reuses
 * constant NoopMetrics for all of its methods.
 */
var NoopMeter = /** @class */ (function () {
    function NoopMeter() {
    }
    /**
     * Returns constant noop value recorder.
     * @param name the name of the metric.
     * @param [options] the metric options.
     */
    NoopMeter.prototype.createValueRecorder = function (_name, _options) {
        return exports.NOOP_VALUE_RECORDER_METRIC;
    };
    /**
     * Returns a constant noop counter.
     * @param name the name of the metric.
     * @param [options] the metric options.
     */
    NoopMeter.prototype.createCounter = function (_name, _options) {
        return exports.NOOP_COUNTER_METRIC;
    };
    /**
     * Returns a constant noop UpDownCounter.
     * @param name the name of the metric.
     * @param [options] the metric options.
     */
    NoopMeter.prototype.createUpDownCounter = function (_name, _options) {
        return exports.NOOP_COUNTER_METRIC;
    };
    /**
     * Returns constant noop value observer.
     * @param name the name of the metric.
     * @param [options] the metric options.
     * @param [callback] the value observer callback
     */
    NoopMeter.prototype.createValueObserver = function (_name, _options, _callback) {
        return exports.NOOP_VALUE_OBSERVER_METRIC;
    };
    /**
     * Returns constant noop sum observer.
     * @param name the name of the metric.
     * @param [options] the metric options.
     * @param [callback] the sum observer callback
     */
    NoopMeter.prototype.createSumObserver = function (_name, _options, _callback) {
        return exports.NOOP_SUM_OBSERVER_METRIC;
    };
    /**
     * Returns constant noop up down sum observer.
     * @param name the name of the metric.
     * @param [options] the metric options.
     * @param [callback] the up down sum observer callback
     */
    NoopMeter.prototype.createUpDownSumObserver = function (_name, _options, _callback) {
        return exports.NOOP_UP_DOWN_SUM_OBSERVER_METRIC;
    };
    /**
     * Returns constant noop batch observer.
     * @param name the name of the metric.
     * @param callback the batch observer callback
     */
    NoopMeter.prototype.createBatchObserver = function (_callback) {
        return exports.NOOP_BATCH_OBSERVER;
    };
    return NoopMeter;
}());
exports.NoopMeter = NoopMeter;
var NoopMetric = /** @class */ (function () {
    function NoopMetric(instrument) {
        this._instrument = instrument;
    }
    /**
     * Returns a Bound Instrument associated with specified Labels.
     * It is recommended to keep a reference to the Bound Instrument instead of
     * always calling this method for every operations.
     * @param labels key-values pairs that are associated with a specific metric
     *     that you want to record.
     */
    NoopMetric.prototype.bind = function (_labels) {
        return this._instrument;
    };
    /**
     * Removes the Binding from the metric, if it is present.
     * @param labels key-values pairs that are associated with a specific metric.
     */
    NoopMetric.prototype.unbind = function (_labels) {
        return;
    };
    /**
     * Clears all timeseries from the Metric.
     */
    NoopMetric.prototype.clear = function () {
        return;
    };
    return NoopMetric;
}());
exports.NoopMetric = NoopMetric;
var NoopCounterMetric = /** @class */ (function (_super) {
    __extends(NoopCounterMetric, _super);
    function NoopCounterMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopCounterMetric.prototype.add = function (value, labels) {
        this.bind(labels).add(value);
    };
    return NoopCounterMetric;
}(NoopMetric));
exports.NoopCounterMetric = NoopCounterMetric;
var NoopValueRecorderMetric = /** @class */ (function (_super) {
    __extends(NoopValueRecorderMetric, _super);
    function NoopValueRecorderMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopValueRecorderMetric.prototype.record = function (value, labels) {
        this.bind(labels).record(value);
    };
    return NoopValueRecorderMetric;
}(NoopMetric));
exports.NoopValueRecorderMetric = NoopValueRecorderMetric;
var NoopBaseObserverMetric = /** @class */ (function (_super) {
    __extends(NoopBaseObserverMetric, _super);
    function NoopBaseObserverMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopBaseObserverMetric.prototype.observation = function () {
        return {
            observer: this,
            value: 0,
        };
    };
    return NoopBaseObserverMetric;
}(NoopMetric));
exports.NoopBaseObserverMetric = NoopBaseObserverMetric;
var NoopBatchObserver = /** @class */ (function () {
    function NoopBatchObserver() {
    }
    return NoopBatchObserver;
}());
exports.NoopBatchObserver = NoopBatchObserver;
var NoopBoundCounter = /** @class */ (function () {
    function NoopBoundCounter() {
    }
    NoopBoundCounter.prototype.add = function (_value) {
        return;
    };
    return NoopBoundCounter;
}());
exports.NoopBoundCounter = NoopBoundCounter;
var NoopBoundValueRecorder = /** @class */ (function () {
    function NoopBoundValueRecorder() {
    }
    NoopBoundValueRecorder.prototype.record = function (_value, _baggage, _spanContext) {
        return;
    };
    return NoopBoundValueRecorder;
}());
exports.NoopBoundValueRecorder = NoopBoundValueRecorder;
var NoopBoundBaseObserver = /** @class */ (function () {
    function NoopBoundBaseObserver() {
    }
    NoopBoundBaseObserver.prototype.update = function (_value) { };
    return NoopBoundBaseObserver;
}());
exports.NoopBoundBaseObserver = NoopBoundBaseObserver;
exports.NOOP_METER = new NoopMeter();
exports.NOOP_BOUND_COUNTER = new NoopBoundCounter();
exports.NOOP_COUNTER_METRIC = new NoopCounterMetric(exports.NOOP_BOUND_COUNTER);
exports.NOOP_BOUND_VALUE_RECORDER = new NoopBoundValueRecorder();
exports.NOOP_VALUE_RECORDER_METRIC = new NoopValueRecorderMetric(exports.NOOP_BOUND_VALUE_RECORDER);
exports.NOOP_BOUND_BASE_OBSERVER = new NoopBoundBaseObserver();
exports.NOOP_VALUE_OBSERVER_METRIC = new NoopBaseObserverMetric(exports.NOOP_BOUND_BASE_OBSERVER);
exports.NOOP_UP_DOWN_SUM_OBSERVER_METRIC = new NoopBaseObserverMetric(exports.NOOP_BOUND_BASE_OBSERVER);
exports.NOOP_SUM_OBSERVER_METRIC = new NoopBaseObserverMetric(exports.NOOP_BOUND_BASE_OBSERVER);
exports.NOOP_BATCH_OBSERVER = new NoopBatchObserver();
//# sourceMappingURL=NoopMeter.js.map