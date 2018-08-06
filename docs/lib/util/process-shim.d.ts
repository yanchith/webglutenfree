/**
 * Shim NODE_ENV. Our production build replaces all usages and it gets DCEd.
 * Downstream users can use replacers or envifiers achieve the same.
 */
export interface Process {
    env: {
        NODE_ENV: "development" | "production";
    };
}
export declare const process: Process;
//# sourceMappingURL=process-shim.d.ts.map