import * as assert from "./assert";
import { IS_DEBUG_BUILD } from "./env";

/**
 * Checks whether array has at least two dimensions.
 * Asserts array is not jagged. Only checks first two dimensions.
 * Returns false if array is degenerate (either dimension is 0), as 0d array
 * is not 2d array.
 */
export function is2<T>(array: T[] | T[][]): array is T[][] {
    if (!array.length) { return false; }
    const length2 = Array.isArray(array[0]) ? (array[0] as unknown[]).length : -1;

    if (IS_DEBUG_BUILD) {
        (array as unknown[]).forEach((sub) => {
            if (length2 !== -1) {
                if (assert.isArray(sub)) {
                    assert.equal(sub.length, length2);
                }
            } else {
                assert.isFalse(Array.isArray(sub));
            }
        });
    }

    // if length2 === 0, array is degenerate
    // if length2 === -1, array is 1d
    return length2 > 0;
}

/**
 * Returns first two dimensions of array. Assumes nonjagged array and does no
 * checks to prove so. Accepts degenerate arrays.
 */
export function shape2<T>(array: T[][]): [number, number] {
    const outer = array.length;
    const inner = outer ? array[0].length : 0;
    return [outer, inner];
}

/**
 * Take an unraveled 2d array and a shape. Returns new flat array with all
 * elements from the original unraveled array. Assumes unraveled array is not
 * jagged and shape matches the unraveled dimensions and makes no checks to
 * prove so. Accepts degenerate arrays if shape matches them.
 */
export function ravel2<T>(unraveled: T[][], shape: [number, number]): T[] {
    const [outer, inner] = shape;
    const raveled: T[] = new Array<T>(inner * outer);
    unraveled.forEach((arr, i) => {
        arr.forEach((elem, j) => {
            raveled[inner * i + j] = elem;
        });
    });
    return raveled;
}
