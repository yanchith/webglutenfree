/**
 * Chacks whether array is at least 2d, mostly useful because of return type
 * predicate.
 */
export function isArray2<T>(array: T[] | T[][]): array is T[][] {
    return !!array.length && Array.isArray(array[0]);
}

export function shape2<T>(array: T[][]): [number, number] {
    const outer = array.length;
    const inner = outer ? array[0].length : 0;
    return [outer, inner];
}

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
