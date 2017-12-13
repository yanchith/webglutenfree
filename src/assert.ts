/**
 * This file is an exercise in proprocessor voodoo.
 *
 * "process.env.NODE_ENV", gets suplied by the string replacer during a
 * custom build. If "production", constant evaluation will eliminate the if
 * blocks, making the functions no-ops, in turn eligible for elimination from
 * their callsites.
 */

 // This does not get replaced and serves as a default velue. If all its uses
 // are eliminated, the value itself is pruned as well.
const process = {
    env: {
        NODE_ENV: "development",
    },
};

export function truthy(a: any, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (!a) { throw new Error(fmt(msg)); }
    }
}

export function equal(a: any, b: any, msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (a !== b) { throw new Error(fmt(msg || `Not equal: ${a} ${b}`)); }
    }
}

export function never(a: never, msg?: string): never {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites. It should never be invoked, though.
    throw new Error(fmt(msg || `Unexpected object: ${a}`));
}

export function notEmpty(a: any[], msg?: string): void {
    if (process.env.NODE_ENV !== "production") {
        if (!a.length) { throw new Error(fmt(msg || "Array empty")); }
    }
}

function fmt(msg?: string): string {
    if (msg) { return `Assertion Failed: ${msg}`; }
    return `Assertion Failed`;
}
