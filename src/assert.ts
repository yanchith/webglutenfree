export function isTrue(condition: boolean, message?: string): void {
    if (!condition) { throw new Error(message || "Assertion failed"); }
}

export function never(x: never, message?: string): never {
    throw new Error(message || "Unexpected object: " + x);
}

export default isTrue;
