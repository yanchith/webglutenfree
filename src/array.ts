/**
 * Chacks whether array is at least 2d, mostly useful because of return type
 * predicate.
 */
export function is2DArray(array: any[] | any[][]): array is any[][] {
    return !!array.length || Array.isArray(array[0]);
}

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
export function ravel<T>(unraveled: T[][]): Raveled<T> {
    const outerShape = unraveled.length;
    const innerShape = outerShape ? unraveled[0].length : 0;
    const raveled: T[] = new Array<T>(innerShape * outerShape);
    unraveled.forEach((inner, i) => {
        inner.forEach((elem, j) => {
            raveled[innerShape * i + j] = elem;
        });
    });
    return { data: raveled, shape: [outerShape, innerShape] };
}
