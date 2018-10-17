// This file contains facilities for determining whether we are currently in a
// debug build. Production builds completely dead-code-eliminate its contents
// and all blocks guarded by `IS_DEBUG_BUILD` throughout the project.
// For nonproduction builds `IS_DEBUG_BUILD` is not eliminated and always
// evaluates to `true`, however, consumers can always perform the
// same dead code elimination further down the road by replacing (or envifying)
// `process.env.NODE_ENV` with "production".

// Rollup has gotten smarter in its analysis and realizes that
// `{ env: { NODE_ENV: "development" } }` is a constant. It would therefore
// inline it and get rid of our shim which would leave no option to replace it
// for our users. Rollup cannot see through the __OPAQUE_TRUE__ (yet) though,
// so it won't inline the `process.env.NODE_ENV` shim.

interface Process {
    env: { NODE_ENV: "development" | "production" };
}

const __OPAQUE_TRUE__ = Math.random() > -1;
const __OPAQUE_ENV__ = __OPAQUE_TRUE__ ? "development" : "production";
const process: Process = { env: { NODE_ENV: __OPAQUE_ENV__ } };

/**
 * Are we in a debug build?
 */
export const IS_DEBUG_BUILD = process.env.NODE_ENV !== "production";
