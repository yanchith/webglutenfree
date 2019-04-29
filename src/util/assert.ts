import { IS_DEBUG_BUILD } from "./env";

export type Primitive = string | number | boolean | null | undefined;

export function is<T extends Primitive>(
    got: Primitive,
    expected: T,
    fmt?: (got: unknown, expected: T) => string,
): got is T {
    const valuesEqual = got === expected;
    if (IS_DEBUG_BUILD) {
        if (!valuesEqual) {
            const msg = fmt
                ? fmt(got, expected)
                : `Assertion failed: value ${got} not equal to ${expected}`;
            throw new Error(msg);
        }
    }
    return valuesEqual;
}

export function isTrue(
    got: unknown,
    fmt?: string | ((got: unknown) => string),
): got is true {
    const valueTrue = got === true;
    if (IS_DEBUG_BUILD) {
        if (!valueTrue) {
            const msg = fmt
                ? typeof fmt === "string" ? fmt : fmt(got)
                : `Assertion failed: values ${got} is not true`;
            throw new Error(msg);
        }
    }
    return valueTrue;
}

export function isBoolean(
    got: unknown,
    fmt?: (got: unknown) => string,
): got is boolean {
    const valueBoolean = typeof got === "boolean";
    if (IS_DEBUG_BUILD) {
        if (!valueBoolean) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not a boolean`;
            throw new Error(msg);
        }
    }
    return valueBoolean;
}

export function isNumber(
    got: unknown,
    fmt?: (got: unknown) => string,
): got is number {
    const valueNumber = typeof got === "number";
    if (IS_DEBUG_BUILD) {
        if (!valueNumber) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not a number`;
            throw new Error(msg);
        }
    }
    return valueNumber;
}

export function isArray(
    got: unknown,
    fmt?: (got: unknown) => string,
): got is unknown[] {
    const valueArray = Array.isArray(got);
    if (IS_DEBUG_BUILD) {
        if (!valueArray) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not an array`;
            throw new Error(msg);
        }
    }
    return valueArray;
}

export function isString(
    got: unknown,
    fmt?: (got: unknown) => string,
): got is string {
    const valueString = typeof got === "string";
    if (IS_DEBUG_BUILD) {
        if (!valueString) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value ${got} not a string`;
            throw new Error(msg);
        }
    }
    return valueString;
}

export function isNotNullOrUndefined<T>(
    got: T | null | undefined,
    fmt?: (got: unknown) => string,
): got is T {
    const valueNotNullOrUndefined = typeof got !== "undefined" && got !== null;
    if (IS_DEBUG_BUILD) {
        if (!valueNotNullOrUndefined) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: value undefined or null`;
            throw new Error(msg);
        }
    }
    return valueNotNullOrUndefined;
}

export function isNotEmpty(
    got: string | unknown[],
    fmt?: (got: string | unknown[]) => string,
): boolean {
    const valueNotEmpty = !!got.length;
    if (IS_DEBUG_BUILD) {
        if (!valueNotEmpty) {
            const msg = fmt
                ? fmt(got)
                : `Assertion failed: string or array value empty`;
            throw new Error(msg);
        }
    }
    return valueNotEmpty;
}

export function isGreater(
    got: number,
    low: number,
    fmt?: (got: number, low: number) => string,
): boolean {
    const valueGreater = got > low;
    if (IS_DEBUG_BUILD) {
        if (!valueGreater) {
            const msg = fmt
                ? fmt(got, low)
                : `Assertion failed: value ${got} not greater than expected ${low}`;
            throw new Error(msg);
        }
    }
    return valueGreater;
}

export function isGreaterEqual(
    got: number,
    low: number,
    fmt?: (got: number, low: number) => string,
): boolean {
    const valueGreaterEqual = got >= low;
    if (IS_DEBUG_BUILD) {
        if (!valueGreaterEqual) {
            const msg = fmt
                ? fmt(got, low)
                : `Assertion failed: value ${got} not greater-equal than expected ${low}`;
            throw new Error(msg);
        }
    }
    return valueGreaterEqual;
}

export function isInRangeInclusive(
    got: number,
    low: number,
    high: number,
    fmt?: (got: number, low: number, high: number) => string,
): boolean {
    const valueInRangeInclusive = got >= low && got <= high;
    if (IS_DEBUG_BUILD) {
        if (!valueInRangeInclusive) {
            const msg = fmt
                ? fmt(got, low, high)
                : `Assertion failed: value ${got} not in range [${low},${high}]`;
            throw new Error(msg);
        }
    }
    return valueInRangeInclusive;
}

export function unreachable(got: never, fmt?: (p: unknown) => string): never {
    // "unreachable" can not be eliminated, as its "return value" is
    // captured by the type system at the callsite for control-flow analysis.
    const msg = fmt
        ? fmt(got)
        : `Assertion failed: this branch should be unreachable`;
    throw new Error(msg);
}
