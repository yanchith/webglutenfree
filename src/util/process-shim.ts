/**
 * Define a subset of node's `process` interface.
 */
export interface Process {
    env: { NODE_ENV: "development" | "production" };
}

// Rollup has gotten smarter and realizes that
// `{ env: { NODE_ENV: "development" } }` is a constant. It therefore inlines
// it, getting rid of our shim, and leaves no option to replace it for our
// users. Rollup cannot see through the __OPAQUE_TRUE__ however, so it can't
// inline the `process.env.NODE_ENV` shim.
const __OPAQUE_TRUE__ = Math.random() > -1;
const __OPAQUE_ENV__ = __OPAQUE_TRUE__ ? "development" : "production";

/**
 * Shim NODE_ENV in node's `process.env`. Our production build replaces
 * all usages making the shim eligible for DCE. Downstream source users can use
 * replacers or envifiers achieve the same.
 */
export const process: Process = { env: { NODE_ENV: __OPAQUE_ENV__ } };
