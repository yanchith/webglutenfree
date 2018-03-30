/**
 * This file is an exercise in preprocessor voodoo.
 *
 * "process.env.NODE_ENV", gets suplied by the string replacer during a
 * custom build or our production build. If "production", constant evaluation
 * will eliminate the if blocks, making the functions no-ops, in turn eligible
 * for elimination from their callsites.
 *
 * While cool, this disables us to return values from the asserts, which would
 * make for a slightly nice programming model: const checkedVal = truthy(val)
 */

// This does not get replaced and serves as a default value. If all its uses
// are eliminated, the value itself is pruned as well.
const process = {
    env: {
        NODE_ENV: "development",
    },
};

export function nonNull<T>(p: T | null | undefined, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (typeof p === "undefined" || typeof p === "object" && !p) {
            throw new Error(fmt(msg || `object is undefined or null`));
        }
    }
}

export function nonEmpty<T>(p: T[], msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (!p.length) {
            throw new Error(fmt(msg || `array is empty`));
        }
    }
}

export function equal<T>(p: T, expected: T, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (p !== expected) {
            throw new Error(
                fmt(msg || `values not equal, expected ${expected}, got ${p}`));
        }
    }
}

export function greater(p: number, low: number, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (p <= low) {
            throw new Error(fmt(msg || `value ${p} not greater than low`));
        }
    }
}

export function range(
    p: number,
    start: number,
    end: number,
    msg?: string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (p < start || p > end) {
            throw new Error(fmt(msg || `value ${p} not in [${start}, ${end}]`));
        }
    }
}

export function never(p: never, msg?: string): never {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites. It should never be invoked, though.
    throw new Error((msg || `unexpected object: ${p}`));
}

function fmt(msg: string): string {
    return `Assertion Failed: ${msg}`;
}
