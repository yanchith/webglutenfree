import process from "./process-shim";

export function nonNull(p: any, fmt?: (got: string) => string): void {
    if (process.env.NODE_ENV !== "production") {
        if (typeof p === "undefined" || typeof p === "object" && !p) {
            const msg = fmt
                ? fmt(p)
                : `Assertion failed: object is undefined or null`;
            throw new Error(msg);
        }
    }
}

export function nonEmpty(
    p: string | any[],
    fmt?: (got: string | any[]) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (!p.length) {
            const msg = fmt
                ? fmt(p)
                : `Assertion failed: string or array is empty`;
            throw new Error(msg);
        }
    }
}

export function equal<T>(
    p: T,
    expected: T,
    fmt?: (got: T, expected: T) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (p !== expected) {
            const msg = fmt
                ? fmt(p, expected)
                : `Assertion failed: values not equal. Expected ${expected}, got ${p}`;
            throw new Error(msg);
        }
    }
}

export function oneOf<T>(
    p: T,
    expected: T[],
    fmt?: (got: T, expected: T[]) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (!expected.includes(p)) {
            const msg = fmt
                ? fmt(p, expected)
                : `Assertion failed: Value ${p} is not one of expected ${expected}`;
            throw new Error(msg);
        }
    }
}

export function gt(
    p: number,
    low: number,
    fmt?: (got: number, low: number) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (p <= low) {
            const msg = fmt
                ? fmt(p, low)
                : `Assertion failed: Value ${p} is lower or equal than expected ${low}`;
            throw new Error(msg);
        }
    }
}

export function rangeInclusive(
    p: number,
    low: number,
    high: number,
    fmt?: (got: number, low: number, high: number) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (p < low || p > high) {
            const msg = fmt
                ? fmt(p, low, high)
                : `Assertion failed: Value ${p} is not in inclusive range [${low}, ${high}]`;
            throw new Error(msg);
        }
    }
}

export function never(p: never, fmt?: (p: any) => string): never {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites for control-flow.
    const msg = fmt
        ? fmt(p)
        : `Assertion failed: This branch should be unreachable`;
    throw new Error(msg);
}
