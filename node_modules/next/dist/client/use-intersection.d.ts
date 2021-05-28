declare type UseIntersectionObserverInit = Pick<IntersectionObserverInit, 'rootMargin'>;
declare type UseIntersection = {
    disabled?: boolean;
} & UseIntersectionObserverInit;
export declare function useIntersection<T extends Element>({ rootMargin, disabled, }: UseIntersection): [(element: T | null) => void, boolean];
export {};
