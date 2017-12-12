export function truthy(a: any, msg?: string): void {
    if (!a) { throw new Error(fmt(msg)); }
}

export function equal(a: any, b: any, msg?: string): void {
    if (a !== b) { throw new Error(fmt(msg || `Not equal: ${a} ${b}`)); }
}

export function never(a: never, msg?: string): never {
    throw new Error(fmt(msg || `Unexpected object: ${a}`));
}

export function notEmpty(a: any[], msg?: string): void {
    if (!a.length) { throw new Error(fmt(msg || "Array empty")); }
}

function fmt(msg?: string): string {
    if (msg) { return `Assertion Failed: ${msg}`; }
    return `Assertion Failed`;
}
