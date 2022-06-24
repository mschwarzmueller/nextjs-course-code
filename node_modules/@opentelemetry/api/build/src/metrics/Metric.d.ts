import { BoundBaseObserver, BoundCounter, BoundValueRecorder } from './BoundInstrument';
import { Logger } from '../common/Logger';
/**
 * Options needed for metric creation
 */
export interface MetricOptions {
    /** The name of the component that reports the Metric. */
    component?: string;
    /**
     * The description of the Metric.
     * @default ''
     */
    description?: string;
    /**
     * The unit of the Metric values.
     * @default '1'
     */
    unit?: string;
    /** The map of constant labels for the Metric. */
    constantLabels?: Map<string, string>;
    /**
     * Indicates the metric is a verbose metric that is disabled by default
     * @default false
     */
    disabled?: boolean;
    /**
     * Indicates the type of the recorded value.
     * @default {@link ValueType.DOUBLE}
     */
    valueType?: ValueType;
    /**
     * User provided logger.
     */
    logger?: Logger;
    /**
     * Boundaries optional for histogram
     */
    boundaries?: number[];
}
export interface BatchObserverOptions {
    /**
     * Indicates how long the batch metric should wait to update before cancel
     */
    maxTimeoutUpdateMS?: number;
    /**
     * User provided logger.
     */
    logger?: Logger;
}
/** The Type of value. It describes how the data is reported. */
export declare enum ValueType {
    INT = 0,
    DOUBLE = 1
}
/**
 * Metric represents a base class for different types of metric
 * pre aggregations.
 */
export interface Metric {
    /**
     * Clears all bound instruments from the Metric.
     */
    clear(): void;
}
/**
 * UnboundMetric represents a base class for different types of metric
 * pre aggregations without label value bound yet.
 */
export interface UnboundMetric<T> extends Metric {
    /**
     * Returns a Instrument associated with specified Labels.
     * It is recommended to keep a reference to the Instrument instead of always
     * calling this method for every operations.
     * @param labels key-values pairs that are associated with a specific metric
     *     that you want to record.
     */
    bind(labels: Labels): T;
    /**
     * Removes the Instrument from the metric, if it is present.
     * @param labels key-values pairs that are associated with a specific metric.
     */
    unbind(labels: Labels): void;
}
/**
 * Counter is the most common synchronous instrument. This instrument supports
 * an `Add(increment)` function for reporting a sum, and is restricted to
 * non-negative increments. The default aggregation is Sum, as for any additive
 * instrument.
 *
 * Example uses for Counter:
 * <ol>
 *   <li> count the number of bytes received. </li>
 *   <li> count the number of requests completed. </li>
 *   <li> count the number of accounts created. </li>
 *   <li> count the number of checkpoints run. </li>
 *   <li> count the number of 5xx errors. </li>
 * <ol>
 */
export interface Counter extends UnboundMetric<BoundCounter> {
    /**
     * Adds the given value to the current value. Values cannot be negative.
     */
    add(value: number, labels?: Labels): void;
}
export interface UpDownCounter extends UnboundMetric<BoundCounter> {
    /**
     * Adds the given value to the current value. Values can be negative.
     */
    add(value: number, labels?: Labels): void;
}
export interface ValueRecorder extends UnboundMetric<BoundValueRecorder> {
    /**
     * Records the given value to this value recorder.
     */
    record(value: number, labels?: Labels): void;
}
/** Base interface for the Observer metrics. */
export interface BaseObserver extends UnboundMetric<BoundBaseObserver> {
    observation: (value: number) => {
        value: number;
        observer: BaseObserver;
    };
}
/** Base interface for the ValueObserver metrics. */
export declare type ValueObserver = BaseObserver;
/** Base interface for the UpDownSumObserver metrics. */
export declare type UpDownSumObserver = BaseObserver;
/** Base interface for the SumObserver metrics. */
export declare type SumObserver = BaseObserver;
/**
 * key-value pairs passed by the user.
 */
export declare type Labels = {
    [key: string]: string;
};
//# sourceMappingURL=Metric.d.ts.map