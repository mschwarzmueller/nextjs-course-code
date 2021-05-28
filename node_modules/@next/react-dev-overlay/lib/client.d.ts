declare function register(): void;
declare function unregister(): void;
declare function onBuildOk(): void;
declare function onBuildError(message: string): void;
declare function onRefresh(): void;
export { getNodeError } from './internal/helpers/nodeStackFrames';
export { default as ReactDevOverlay } from './internal/ReactDevOverlay';
export { onBuildOk, onBuildError, register, unregister, onRefresh };
