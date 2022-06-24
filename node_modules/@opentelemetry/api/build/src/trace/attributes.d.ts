export interface Attributes {
    [attributeKey: string]: AttributeValue | undefined;
}
/**
 * Attribute values may be any non-nullish primitive value except an object.
 *
 * null or undefined attribute values are invalid and will result in undefined behavior.
 */
export declare type AttributeValue = string | number | boolean | Array<null | undefined | string> | Array<null | undefined | number> | Array<null | undefined | boolean>;
//# sourceMappingURL=attributes.d.ts.map