import { Exception } from '../common/Exception';
import { TimeInput } from '../common/Time';
import { Attributes } from './attributes';
import { Span } from './span';
import { SpanContext } from './span_context';
import { Status } from './status';
/**
 * The NoopSpan is the default {@link Span} that is used when no Span
 * implementation is available. All operations are no-op including context
 * propagation.
 */
export declare class NoopSpan implements Span {
    private readonly _spanContext;
    constructor(_spanContext?: SpanContext);
    context(): SpanContext;
    setAttribute(_key: string, _value: unknown): this;
    setAttributes(_attributes: Attributes): this;
    addEvent(_name: string, _attributes?: Attributes): this;
    setStatus(_status: Status): this;
    updateName(_name: string): this;
    end(_endTime?: TimeInput): void;
    isRecording(): boolean;
    recordException(_exception: Exception, _time?: TimeInput): void;
}
export declare const NOOP_SPAN: NoopSpan;
//# sourceMappingURL=NoopSpan.d.ts.map