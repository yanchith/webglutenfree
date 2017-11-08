/**
 * Chacks whether  array is at least 2d, mostly useful because of return type
 * predicate.
 */
export declare function is2DArray(array: any[] | any[][]): array is any[][];
export interface Raveled<T> {
    data: T[];
    shape: [number, number];
}
/**
 * Flatten 2d array and compute its former shape.
 * eg.
 * ravel([
 *      [1, 2, 3],
 *      [4, 5, 6],
 * ])
 * produces {
 *      data: [1, 2, 3, 4, 5, 6],
 *      shape: [2, 3],
 * }
 */
export declare function ravel<T>(unraveled: T[][]): Raveled<T>;
