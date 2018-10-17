import { process } from "./process-shim";

export function isTrue(
    got: unknown,
    fmt?: (got: unknown) => string,
): got is true {
    const valueIsTrue = got === true;
    if (process.env.NODE_ENV !== "production") {
        if (!valueIsTrue) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not true`;
            throw new Error(msg);
        }
    }
    return valueIsTrue;
}

export function isFalse(
    got: unknown, fmt?:
    (got: unknown) => string,
): got is false {
    const valueIsFalse = got === false;
    if (process.env.NODE_ENV !== "production") {
        if (!valueIsFalse) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not false`;
            throw new Error(msg);
        }
    }
    return valueIsFalse;
}

export function isArray(
    got: unknown,
    fmt?: (got: unknown) => string,
): got is unknown[] {
    const valueIsArray = Array.isArray(got);
    if (process.env.NODE_ENV !== "production") {
        if (!valueIsArray) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not an array`;
            throw new Error(msg);
        }
    }
    return valueIsArray;
}

export function nonNull(
    got: unknown,
    fmt?: (got: unknown) => string,
): boolean {
    const valueIsNonNull = typeof got === "undefined"
        || typeof got === "object" && !got;
    if (process.env.NODE_ENV !== "production") {
        if (!valueIsNonNull) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value undefined or null`;
            throw new Error(msg);
        }
    }
    return valueIsNonNull;
}

export function nonEmpty<T>(
    got: string | T[],
    fmt?: (got: string | T[]) => string,
): boolean {
    const valueIsNonEmpty = !!got.length;
    if (process.env.NODE_ENV !== "production") {
        if (!valueIsNonEmpty) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: string or array value empty`;
            throw new Error(msg);
        }
    }
    return valueIsNonEmpty;
}

export function equal<T>(
    got: T,
    expected: T,
    fmt?: (got: T, expected: T) => string,
): boolean {
    const valuesAreEqual = got === expected;
    if (process.env.NODE_ENV !== "production") {
        if (!valuesAreEqual) {
            const msg = fmt
                ? fmt(got, expected)
                : `Assertion failed: value ${got} not equal to ${expected}`;
            throw new Error(msg);
        }
    }
    return valuesAreEqual;
}

export function oneOf<T>(
    got: T,
    expected: T[],
    fmt?: (got: T, expected: T[]) => string,
): boolean {
    const valueIsOneOf = expected.includes(got);
    if (process.env.NODE_ENV !== "production") {
        if (!valueIsOneOf) {
            const msg = fmt
                ? fmt(got, expected)
                : `Assertion failed: value ${got} not in ${expected}`;
            throw new Error(msg);
        }
    }
    return valueIsOneOf;
}

export function gt(
    got: number,
    low: number,
    fmt?: (got: number, low: number) => string,
): boolean {
    const valueIsGt = got > low;
    if (process.env.NODE_ENV !== "production") {
        if (!valueIsGt) {
            const msg = fmt
                ? fmt(got, low)
                : `Assertion failed: value ${got} not GT than expected ${low}`;
            throw new Error(msg);
        }
    }
    return valueIsGt;
}

export function gte(
    got: number,
    low: number,
    fmt?: (got: number, low: number) => string,
): boolean {
    const valueIsGte = got >= low;
    if (process.env.NODE_ENV !== "production") {
        if (!valueIsGte) {
            const msg = fmt
                ? fmt(got, low)
                : `Assertion failed: value ${got} not GTE than expected ${low}`;
            throw new Error(msg);
        }
    }
    return valueIsGte;
}

export function rangeInclusive(
    got: number,
    low: number,
    high: number,
    fmt?: (got: number, low: number, high: number) => string,
): boolean {
    const valueIsInRangeInclusive = got >= low && got <= high;
    if (process.env.NODE_ENV !== "production") {
        if (!valueIsInRangeInclusive) {
            const msg = fmt
                ? fmt(got, low, high)
                : `Assertion failed: value ${got} not in range [${low},${high}]`;
            throw new Error(msg);
        }
    }
    return valueIsInRangeInclusive;
}

export function unreachable(got: never, fmt?: (p: unknown) => string): never {
    // "never" can not be eliminated, as its "return value" is actually captured
    // at the callsites for control-flow.
    const msg = fmt
        ? fmt(got)
        : `Assertion failed: this branch should be unreachable`;
    throw new Error(msg);
}
