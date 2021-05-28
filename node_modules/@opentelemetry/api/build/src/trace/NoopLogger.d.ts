import { Logger } from '../common/Logger';
/** No-op implementation of Logger */
export declare class NoopLogger implements Logger {
    debug(_message: string, ..._args: unknown[]): void;
    error(_message: string, ..._args: unknown[]): void;
    warn(_message: string, ..._args: unknown[]): void;
    info(_message: string, ..._args: unknown[]): void;
}
//# sourceMappingURL=NoopLogger.d.ts.map