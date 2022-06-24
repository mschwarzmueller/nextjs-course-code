import { EntryValue } from './EntryValue';
/**
 * Baggage represents collection of entries. Each key of
 * Baggage is associated with exactly one value. Baggage
 * is serializable, to facilitate propagating it not only inside the process
 * but also across process boundaries. Baggage is used to annotate
 * telemetry with the name:value pair Entry. Those values can be used to add
 * dimension to the metric or additional contest properties to logs and traces.
 */
export interface Baggage {
    [entryKey: string]: EntryValue;
}
//# sourceMappingURL=Baggage.d.ts.map