/**
 * Chacks whether array has at least two dimensions.
 * Asserts array is not jagged. Only checks first two dimensions.
 * Returns false if array is degenerate (either dimension is 0), as 0d array
 * is not 2d array.
 */
export declare function is2<T>(array: T[] | T[][]): array is T[][];
/**
 * Returns first two dimensions of array. Assumes nonjagged array and does no
 * checks to prove so. Accepts degenerate arrays.
 */
export declare function shape2<T>(array: T[][]): [number, number];
/**
 * Take an unraveled 2d array and a shape. Returns new flat array with all
 * elements from the original unraveled array. Assumes unraveled array is not
 * jagged and shape matches the unraveled dimensions and makes no checks to
 * prove so. Accepts degenerate arrays if shape matches them.
 */
export declare function ravel2<T>(unraveled: T[][], shape: [number, number]): T[];
//# sourceMappingURL=array.d.ts.map