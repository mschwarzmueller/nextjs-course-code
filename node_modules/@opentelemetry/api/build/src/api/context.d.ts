import { Context, ContextManager } from '@opentelemetry/context-base';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Context API
 */
export declare class ContextAPI {
    private static _instance?;
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    private constructor();
    /** Get the singleton instance of the Context API */
    static getInstance(): ContextAPI;
    /**
     * Set the current context manager. Returns the initialized context manager
     */
    setGlobalContextManager(contextManager: ContextManager): ContextManager;
    /**
     * Get the currently active context
     */
    active(): Context;
    /**
     * Execute a function with an active context
     *
     * @param context context to be active during function execution
     * @param fn function to execute in a context
     */
    with<T extends (...args: unknown[]) => ReturnType<T>>(context: Context, fn: T): ReturnType<T>;
    /**
     * Bind a context to a target function or event emitter
     *
     * @param target function or event emitter to bind
     * @param context context to bind to the event emitter or function. Defaults to the currently active context
     */
    bind<T>(target: T, context?: Context): T;
    private _getContextManager;
    /** Disable and remove the global context manager */
    disable(): void;
}
//# sourceMappingURL=context.d.ts.map