import { BatchObserverResult } from './BatchObserverResult';
import { Meter } from './Meter';
import { MetricOptions, UnboundMetric, Labels, Counter, ValueRecorder, ValueObserver, UpDownCounter, BaseObserver, UpDownSumObserver } from './Metric';
import { BoundValueRecorder, BoundCounter, BoundBaseObserver } from './BoundInstrument';
import { Baggage } from '../baggage/Baggage';
import { SpanContext } from '../trace/span_context';
import { ObserverResult } from './ObserverResult';
/**
 * NoopMeter is a noop implementation of the {@link Meter} interface. It reuses
 * constant NoopMetrics for all of its methods.
 */
export declare class NoopMeter implements Meter {
    constructor();
    /**
     * Returns constant noop value recorder.
     * @param name the name of the metric.
     * @param [options] the metric options.
     */
    createValueRecorder(_name: string, _options?: MetricOptions): ValueRecorder;
    /**
     * Returns a constant noop counter.
     * @param name the name of the metric.
     * @param [options] the metric options.
     */
    createCounter(_name: string, _options?: MetricOptions): Counter;
    /**
     * Returns a constant noop UpDownCounter.
     * @param name the name of the metric.
     * @param [options] the metric options.
     */
    createUpDownCounter(_name: string, _options?: MetricOptions): UpDownCounter;
    /**
     * Returns constant noop value observer.
     * @param name the name of the metric.
     * @param [options] the metric options.
     * @param [callback] the value observer callback
     */
    createValueObserver(_name: string, _options?: MetricOptions, _callback?: (observerResult: ObserverResult) => void): ValueObserver;
    /**
     * Returns constant noop sum observer.
     * @param name the name of the metric.
     * @param [options] the metric options.
     * @param [callback] the sum observer callback
     */
    createSumObserver(_name: string, _options?: MetricOptions, _callback?: (observerResult: ObserverResult) => void): ValueObserver;
    /**
     * Returns constant noop up down sum observer.
     * @param name the name of the metric.
     * @param [options] the metric options.
     * @param [callback] the up down sum observer callback
     */
    createUpDownSumObserver(_name: string, _options?: MetricOptions, _callback?: (observerResult: ObserverResult) => void): UpDownSumObserver;
    /**
     * Returns constant noop batch observer.
     * @param name the name of the metric.
     * @param callback the batch observer callback
     */
    createBatchObserver(_callback: (batchObserverResult: BatchObserverResult) => void): NoopBatchObserver;
}
export declare class NoopMetric<T> implements UnboundMetric<T> {
    private readonly _instrument;
    constructor(instrument: T);
    /**
     * Returns a Bound Instrument associated with specified Labels.
     * It is recommended to keep a reference to the Bound Instrument instead of
     * always calling this method for every operations.
     * @param labels key-values pairs that are associated with a specific metric
     *     that you want to record.
     */
    bind(_labels: Labels): T;
    /**
     * Removes the Binding from the metric, if it is present.
     * @param labels key-values pairs that are associated with a specific metric.
     */
    unbind(_labels: Labels): void;
    /**
     * Clears all timeseries from the Metric.
     */
    clear(): void;
}
export declare class NoopCounterMetric extends NoopMetric<BoundCounter> implements Counter {
    add(value: number, labels: Labels): void;
}
export declare class NoopValueRecorderMetric extends NoopMetric<BoundValueRecorder> implements ValueRecorder {
    record(value: number, labels: Labels): void;
}
export declare class NoopBaseObserverMetric extends NoopMetric<BoundBaseObserver> implements BaseObserver {
    observation(): {
        observer: BaseObserver;
        value: number;
    };
}
export declare class NoopBatchObserver {
}
export declare class NoopBoundCounter implements BoundCounter {
    add(_value: number): void;
}
export declare class NoopBoundValueRecorder implements BoundValueRecorder {
    record(_value: number, _baggage?: Baggage, _spanContext?: SpanContext): void;
}
export declare class NoopBoundBaseObserver implements BoundBaseObserver {
    update(_value: number): void;
}
export declare const NOOP_METER: NoopMeter;
export declare const NOOP_BOUND_COUNTER: NoopBoundCounter;
export declare const NOOP_COUNTER_METRIC: NoopCounterMetric;
export declare const NOOP_BOUND_VALUE_RECORDER: NoopBoundValueRecorder;
export declare const NOOP_VALUE_RECORDER_METRIC: NoopValueRecorderMetric;
export declare const NOOP_BOUND_BASE_OBSERVER: NoopBoundBaseObserver;
export declare const NOOP_VALUE_OBSERVER_METRIC: NoopBaseObserverMetric;
export declare const NOOP_UP_DOWN_SUM_OBSERVER_METRIC: NoopBaseObserverMetric;
export declare const NOOP_SUM_OBSERVER_METRIC: NoopBaseObserverMetric;
export declare const NOOP_BATCH_OBSERVER: NoopBatchObserver;
//# sourceMappingURL=NoopMeter.d.ts.map