/**
 * This file is an exercise in proprocessor voodoo.
 *
 * "process.env.NODE_ENV", gets suplied by the string replacer during a
 * custom build or our production build. If "production", constant evaluation
 * will eliminate the if blocks, making the functions no-ops, in turn eligible
 * for elimination from their callsites.
 *
 * While cool, this disables us to return values from the asserts, which would
 * make for a slightly nice programming model: const checkedVal = truthy(val)
 */

// This does not get replaced and serves as a default velue. If all its uses
// are eliminated, the value itself is pruned as well.
const process = {
    env: {
        NODE_ENV: "development",
    },
};

export function nonNull(p: any, name?: string, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (typeof p === "undefined" || typeof p === "object" && !p) {
            throw new Error(msg || fmt(`object ${name || ""} ${p}`));
        }
    }
}

export function nonEmpty(p: any[], name?: string, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (!p || !p.length) {
            throw new Error(msg || fmt(`array ${name || ""} empty`));
        }
    }
}

export function equal(p: any, val: any, name?: string, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (p !== val) {
            throw new Error(msg || fmt(`${name || ""} values not equal: ${p} ${val}`));
        }
    }
}

export function range(
    p: number,
    start: number,
    end: number,
    name?: string,
    msg?: string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (p < start || p > end) {
            throw new Error(msg || fmt(`${name || ""} value ${p} not in [${start}, ${end}]`));
        }
    }
}

export function never(p: never, msg?: string): never {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites. It should never be invoked, though.
    throw new Error(msg || fmt(`Unexpected object: ${p}`));
}

function fmt(msg: string): string {
    return `Assertion Failed: ${msg}`;
}
