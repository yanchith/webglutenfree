/**
 * Define a subset of node's `process` interface.
 */
export interface Process {
    env: {
        NODE_ENV: "development" | "production";
    };
}
/**
 * Shim NODE_ENV in node's `process.env`. Our production build replaces
 * all usages making the shim eligible for DCE. Downstream source users can use
 * replacers or envifiers achieve the same.
 */
export declare const process: Process;
//# sourceMappingURL=process-shim.d.ts.map