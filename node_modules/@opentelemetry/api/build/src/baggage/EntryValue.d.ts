export interface EntryValue {
    /** `String` value of the `EntryValue`. */
    value: string;
    /**
     * ttl is an integer that represents number of hops an entry can
     * propagate.
     */
    ttl?: EntryTtl;
}
/**
 * EntryTtl is an integer that represents number of hops an entry can propagate.
 *
 * For now, ONLY special values (0 and -1) are supported.
 */
export declare enum EntryTtl {
    /**
     * NO_PROPAGATION is considered to have local context and is used within the
     * process it created.
     */
    NO_PROPAGATION = 0,
    /** UNLIMITED_PROPAGATION can propagate unlimited hops. */
    UNLIMITED_PROPAGATION = -1
}
//# sourceMappingURL=EntryValue.d.ts.map