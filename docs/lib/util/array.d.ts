/**
 * Chacks whether array is at least 2d, mostly useful because of return type
 * predicate.
 */
export declare function isArray2<T>(array: T[] | T[][]): array is T[][];
export declare function shape2<T>(array: T[][]): [number, number];
export declare function ravel2<T>(unraveled: T[][], shape: [number, number]): T[];
//# sourceMappingURL=array.d.ts.map