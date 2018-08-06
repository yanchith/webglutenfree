import { process } from "./process-shim";

export function isTrue(got: any, fmt?: (got: any) => string): void {
    if (process.env.NODE_ENV !== "production") {
        if (got !== true) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not true`;
            throw new Error(msg);
        }
    }
}

export function isFalse(got: any, fmt?: (got: any) => string): void {
    if (process.env.NODE_ENV !== "production") {
        if (got !== false) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not false`;
            throw new Error(msg);
        }
    }
}

export function nonNull(got: any, fmt?: (got: any) => string): void {
    if (process.env.NODE_ENV !== "production") {
        if (typeof got === "undefined" || typeof got === "object" && !got) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value undefined or null`;
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
                : `Assertion failed: string or array value empty`;
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
                : `Assertion failed: value ${got} not equal to ${expected}`;
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
                : `Assertion failed: value ${got} not in ${expected}`;
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
                : `Assertion failed: value ${got} not GT than expected ${low}`;
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
                : `Assertion failed: value ${got} not GTE than expected ${low}`;
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
                : `Assertion failed: value ${got} not in range [${low},${high}]`;
            throw new Error(msg);
        }
    }
}

export function unreachable(got: never, fmt?: (p: any) => string): never {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites for control-flow.
    const msg = fmt
        ? fmt(got)
        : `Assertion failed: this branch should be unreachable`;
    throw new Error(msg);
}
