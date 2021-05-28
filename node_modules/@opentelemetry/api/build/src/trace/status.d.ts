export interface Status {
    /** The status code of this message. */
    code: StatusCode;
    /** A developer-facing error message. */
    message?: string;
}
/**
 * An enumeration of status codes.
 */
export declare enum StatusCode {
    /**
     * The operation has been validated by an Application developer or
     * Operator to have completed successfully.
     */
    OK = 0,
    /**
     * The default status.
     */
    UNSET = 1,
    /**
     * The operation contains an error.
     */
    ERROR = 2
}
//# sourceMappingURL=status.d.ts.map