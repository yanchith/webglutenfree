export declare function nonNull(p: any, fmt?: (got: string) => string): void;
export declare function nonEmpty(p: string | any[], fmt?: (got: string | any[]) => string): void;
export declare function equal<T>(p: T, expected: T, fmt?: (got: T, expected: T) => string): void;
export declare function oneOf<T>(p: T, expected: T[], fmt?: (got: T, expected: T[]) => string): void;
export declare function gt(p: number, low: number, fmt?: (got: number, low: number) => string): void;
export declare function rangeInclusive(p: number, low: number, high: number, fmt?: (got: number, low: number, high: number) => string): void;
export declare function never(p: never, fmt?: (p: any) => string): never;
//# sourceMappingURL=assert.d.ts.map