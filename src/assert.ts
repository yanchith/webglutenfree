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

export function paramNonNull(p: any, name: string): void {
    nonNull(p, fmt(fmt(`Expected parameter ${name}, but got ${p}`)));
}

export function paramNonEmpty(p: any[], name: string): void {
    nonEmpty(p, fmt(`Expected parameter ${name} to be nonempty`));
}

export function paramEqual(p: any, val: any, name: string): void {
    equal(
        p,
        val,
        fmt(`Expected parameter ${name} to be equal to ${val}, but got ${p}`),
    );
}

export function paramRange(
    p: number,
    start: number,
    end: number,
    name: string,
): void {
    range(
        p,
        start,
        end,
        fmt(`Expected parameter ${name} to be in range [${start}, ${end}], but got ${p}`),
    );
}

export function nonNull(p: any, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (typeof p === "undefined" || typeof p === "object" && !p) {
            throw new Error(msg || fmt("Object null"));
        }
    }
}

export function nonEmpty(p: any[], msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (!p || !p.length) {
            throw new Error(msg || fmt("Array empty"));
        }
    }
}

export function equal(p: any, val: any, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (p !== val) {
            throw new Error(msg || fmt(`Not equal: ${p} ${val}`));
        }
    }
}

export function range(p: number, start: number, end: number, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (p < start || p > end) {
            throw new Error(msg || fmt(`Value ${p} not in [${start}, ${end}]`));
        }
    }
}

export function never(p: never, msg?: string): never {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites. It should never be invoked, though.
    throw new Error(msg || fmt(`Unexpected object: ${p}`));
}

function fmt(msg?: string): string {
    if (msg) { return `Assertion Failed: ${msg}`; }
    return `Assertion Failed`;
}
