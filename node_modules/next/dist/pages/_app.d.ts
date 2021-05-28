/// <reference types="node" />
import React, { ErrorInfo } from 'react';
import { AppContextType, AppInitialProps, AppPropsType, NextWebVitalsMetric } from '../next-server/lib/utils';
import { Router } from '../client/router';
export { AppInitialProps };
export { NextWebVitalsMetric };
export declare type AppContext = AppContextType<Router>;
export declare type AppProps<P = {}> = AppPropsType<Router, P>;
/**
 * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
 * This allows for keeping state between navigation, custom error handling, injecting additional data.
 */
declare function appGetInitialProps({ Component, ctx, }: AppContext): Promise<AppInitialProps>;
export default class App<P = {}, CP = {}, S = {}> extends React.Component<P & AppProps<CP>, S> {
    static origGetInitialProps: typeof appGetInitialProps;
    static getInitialProps: typeof appGetInitialProps;
    componentDidCatch(error: Error, _errorInfo: ErrorInfo): void;
    render(): JSX.Element;
}
export declare function Container(p: any): any;
export declare function createUrl(router: Router): {
    readonly query: import("querystring").ParsedUrlQuery;
    readonly pathname: string;
    readonly asPath: string;
    back: () => void;
    push: (url: string, as?: string | undefined) => Promise<boolean>;
    pushTo: (href: string, as?: string | undefined) => Promise<boolean>;
    replace: (url: string, as?: string | undefined) => Promise<boolean>;
    replaceTo: (href: string, as?: string | undefined) => Promise<boolean>;
};
