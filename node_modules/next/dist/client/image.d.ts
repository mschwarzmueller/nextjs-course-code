/// <reference types="react" />
declare const VALID_LOADING_VALUES: readonly ["lazy", "eager", undefined];
declare type LoadingValue = typeof VALID_LOADING_VALUES[number];
export declare type ImageLoader = (resolverProps: ImageLoaderProps) => string;
export declare type ImageLoaderProps = {
    src: string;
    width: number;
    quality?: number;
};
declare const VALID_LAYOUT_VALUES: readonly ["fill", "fixed", "intrinsic", "responsive", undefined];
declare type LayoutValue = typeof VALID_LAYOUT_VALUES[number];
declare type ImgElementStyle = NonNullable<JSX.IntrinsicElements['img']['style']>;
export declare type ImageProps = Omit<JSX.IntrinsicElements['img'], 'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading' | 'style'> & {
    src: string;
    loader?: ImageLoader;
    quality?: number | string;
    priority?: boolean;
    loading?: LoadingValue;
    unoptimized?: boolean;
    objectFit?: ImgElementStyle['objectFit'];
    objectPosition?: ImgElementStyle['objectPosition'];
} & ({
    width?: never;
    height?: never;
    /** @deprecated Use `layout="fill"` instead */
    unsized: true;
} | {
    width?: never;
    height?: never;
    layout: 'fill';
} | {
    width: number | string;
    height: number | string;
    layout?: Exclude<LayoutValue, 'fill'>;
});
export default function Image({ src, sizes, unoptimized, priority, loading, className, quality, width, height, objectFit, objectPosition, loader, ...all }: ImageProps): JSX.Element;
export {};
