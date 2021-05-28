/** An Instrument for Counter Metric. */
export interface BoundCounter {
    /**
     * Adds the given value to the current value. Values cannot be negative.
     * @param value the value to add.
     */
    add(value: number): void;
}
/** ValueRecorder to report instantaneous measurement of a value. */
export interface BoundValueRecorder {
    /**
     * Records the given value to this value recorder.
     * @param value to record.
     */
    record(value: number): void;
}
/** An Instrument for Base Observer */
export interface BoundBaseObserver {
    update(value: number): void;
}
//# sourceMappingURL=BoundInstrument.d.ts.map