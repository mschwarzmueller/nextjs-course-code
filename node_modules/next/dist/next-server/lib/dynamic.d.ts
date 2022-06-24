import React from 'react';
export declare type LoaderComponent<P = {}> = Promise<React.ComponentType<P> | {
    default: React.ComponentType<P>;
}>;
export declare type Loader<P = {}> = (() => LoaderComponent<P>) | LoaderComponent<P>;
export declare type LoaderMap = {
    [mdule: string]: () => Loader<any>;
};
export declare type LoadableGeneratedOptions = {
    webpack?(): any;
    modules?(): LoaderMap;
};
export declare type LoadableBaseOptions<P = {}> = LoadableGeneratedOptions & {
    loading?: ({ error, isLoading, pastDelay, }: {
        error?: Error | null;
        isLoading?: boolean;
        pastDelay?: boolean;
        retry?: () => void;
        timedOut?: boolean;
    }) => JSX.Element | null;
    loader?: Loader<P> | LoaderMap;
    loadableGenerated?: LoadableGeneratedOptions;
    ssr?: boolean;
};
export declare type LoadableOptions<P = {}> = LoadableBaseOptions<P> & {
    render?(loader: any, props: any): JSX.Element;
};
export declare type DynamicOptions<P = {}> = LoadableBaseOptions<P> & {
    /**
     * @deprecated the modules option has been planned for removal
     */
    render?(props: P, loaded: any): JSX.Element;
};
export declare type LoadableFn<P = {}> = (opts: LoadableOptions<P>) => React.ComponentType<P>;
export declare type LoadableComponent<P = {}> = React.ComponentType<P>;
export declare function noSSR<P = {}>(LoadableInitializer: LoadableFn<P>, loadableOptions: LoadableOptions<P>): React.ComponentType<P>;
export default function dynamic<P = {}>(dynamicOptions: DynamicOptions<P> | Loader<P>, options?: DynamicOptions<P>): React.ComponentType<P>;
