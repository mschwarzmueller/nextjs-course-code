import React from 'react';
import { ScriptHTMLAttributes } from 'react';
interface Props extends ScriptHTMLAttributes<HTMLScriptElement> {
    strategy?: 'defer' | 'lazy' | 'dangerouslyBlockRendering' | 'eager';
    id?: string;
    onLoad?: () => void;
    onError?: () => void;
    children?: React.ReactNode;
    preload?: boolean;
}
export default function Script(props: Props): JSX.Element | null;
export {};
