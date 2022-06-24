import React from 'react';
declare type ErrorBoundaryProps = {
    onError: (error: Error, componentStack: string | null) => void;
};
declare type ErrorBoundaryState = {
    error: Error | null;
};
declare class ErrorBoundary extends React.PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
    state: {
        error: null;
    };
    componentDidCatch(error: Error, errorInfo?: {
        componentStack?: string | null;
    }): void;
    render(): {} | null | undefined;
}
export { ErrorBoundary };
