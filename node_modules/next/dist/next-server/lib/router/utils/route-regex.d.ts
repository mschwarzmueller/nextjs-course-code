export interface Group {
    pos: number;
    repeat: boolean;
    optional: boolean;
}
export declare function getRouteRegex(normalizedRoute: string): {
    re: RegExp;
    namedRegex?: string;
    routeKeys?: {
        [named: string]: string;
    };
    groups: {
        [groupName: string]: Group;
    };
};
