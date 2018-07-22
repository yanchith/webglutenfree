import { process } from "./process-shim";

export function isTrue(got: any, fmt?: (got: any) => string): void {
    if (process.env.NODE_ENV !== "production") {
        if (got !== true) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: expected true, got ${got}`;
            throw new Error(msg);
        }
    }
}

export function isFalse(got: any, fmt?: (got: any) => string): void {
    if (process.env.NODE_ENV !== "production") {
        if (got !== false) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: expected false, got ${got}`;
            throw new Error(msg);
        }
    }
}

export function nonNull(got: any, fmt?: (got: any) => string): void {
    if (process.env.NODE_ENV !== "production") {
        if (typeof got === "undefined" || typeof got === "object" && !got) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: object is undefined or null`;
            throw new Error(msg);
        }
    }
}

export function nonEmpty<T>(
    got: string | T[],
    fmt?: (got: string | T[]) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (!got.length) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: string or array is empty`;
            throw new Error(msg);
        }
    }
}

export function equal<T>(
    got: T,
    expected: T,
    fmt?: (got: T, expected: T) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (got !== expected) {
            const msg = fmt
                ? fmt(got, expected)
                : `Assertion failed: values not equal. Expected ${expected}, got ${got}`;
            throw new Error(msg);
        }
    }
}

export function oneOf<T>(
    got: T,
    expected: T[],
    fmt?: (got: T, expected: T[]) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (!expected.includes(got)) {
            const msg = fmt
                ? fmt(got, expected)
                : `Assertion failed: value ${got} is not one of expected ${expected}`;
            throw new Error(msg);
        }
    }
}

export function gt(
    got: number,
    low: number,
    fmt?: (got: number, low: number) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (got <= low) {
            const msg = fmt
                ? fmt(got, low)
                : `Assertion failed: value ${got} is lower or equal than expected ${low}`;
            throw new Error(msg);
        }
    }
}

export function gte(
    got: number,
    low: number,
    fmt?: (got: number, low: number) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (got < low) {
            const msg = fmt
                ? fmt(got, low)
                : `Assertion failed: value ${got} is lower than expected ${low}`;
            throw new Error(msg);
        }
    }
}

export function rangeInclusive(
    got: number,
    low: number,
    high: number,
    fmt?: (got: number, low: number, high: number) => string,
): void {
    if (process.env.NODE_ENV !== "production") {
        if (got < low || got > high) {
            const msg = fmt
                ? fmt(got, low, high)
                : `Assertion failed: value ${got} is not in inclusive range [${low}, ${high}]`;
            throw new Error(msg);
        }
    }
}

export function never(got: never, fmt?: (p: any) => string): never {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites for control-flow.
    const msg = fmt
        ? fmt(got)
        : `Assertion failed: this branch should be unreachable`;
    throw new Error(msg);
}
