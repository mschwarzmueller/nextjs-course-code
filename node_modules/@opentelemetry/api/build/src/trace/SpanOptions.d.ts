import { Attributes } from './attributes';
import { Link } from './link';
import { SpanKind } from './span_kind';
/**
 * Options needed for span creation
 */
export interface SpanOptions {
    /**
     * The SpanKind of a span
     * @default {@link SpanKind.INTERNAL}
     */
    kind?: SpanKind;
    /** A span's attributes */
    attributes?: Attributes;
    /** {@link Link}s span to other spans */
    links?: Link[];
    /** A manually specified start time for the created `Span` object. */
    startTime?: number;
    /** The new span should be a root span. (Ignore parent from context). */
    root?: boolean;
}
//# sourceMappingURL=SpanOptions.d.ts.map