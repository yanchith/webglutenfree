/// <reference types="webgl2" />
/**
 * A thin layer on top of WebGL remembering the current state, only
 * setting the actual WebGL state when needed.
 */
export declare class State {
    readonly gl: WebGL2RenderingContext;
    private target;
    private glDrawFramebuffer;
    private glDrawBuffers;
    private command;
    private glProgram;
    private depthTest;
    private stencilTest;
    private blend;
    constructor(gl: WebGL2RenderingContext);
    /**
     * Set the depth test strategy if it differs from the current one.
     */
    setDepthTest(depthTest: DepthTestDescriptor | null): void;
    /**
     * Set the stencil test strategy if it differs from the current
     * one.
     */
    setStencilTest(stencilTest: StencilTestDescriptor | null): void;
    /**
     * Set the blending strategy if it differs from the current one.
     */
    setBlend(blend: BlendDescriptor | null): void;
    /**
     * Bind a `Target` for this `State`. Compare the underlying
     * framebuffer and draw buffers and only set them if needed.
     *
     * Each `Device` must have at most one `Target` bound at any
     * time. Nested target binding is not supported even though it is
     * not prohibited by the shape of the API:
     *
     * ```typescript
     * // This produces a runtime error
     * fbo.target((fbort) => {
     *     dev.target((rt) => rt.draw(...));
     *     fbort.draw(...);
     * });
     * ```
     */
    bindTarget(target: object, glDrawFramebuffer: WebGLFramebuffer | null, glDrawBuffers: number[]): void;
    /**
     * Forget the currently bound target. Does not unbind the
     * framebuffer nor the draw buffers, expecting they will be
     * conditionally bound in the next call to `State.bindTarget()`.
     *
     * Errors if the target is either `null` or `undefined` already,
     * as those either indicate an invalid use of `reset()`, or a bug.
     */
    forgetTarget(): void;
    /**
     * Bind a `Command` for this `State`. Compare the underlying
     * program and only set it if needed.
     *
     * Each `Device` must have at most one `Command` bound at any
     * time. Nested command binding is not supported even though it is
     * not prohibited by the shape of the API:
     *
     * ```typescript
     * // This produces a runtime error
     * dev.target((rt) => {
     *     rt.batch(cmd, (draw) => {
     *         rt.draw(cmd, attrs, props);
     *     });
     * });
     * ```
     */
    bindCommand(command: object, glProgram: WebGLProgram | null): void;
    /**
     * Forget the currently bound command. Does not unbind the
     * program, expecting it will be conditionally bound in the next
     * call to `State.bindCommand()`.
     *
     * Errors if the command is either `null` or `undefined` already,
     * as those either indicate an invalid use of `reset()`, or a bug.
     */
    forgetCommand(): void;
    /**
     * Assert that the currently bound target is the same one as the
     * parameter.
     */
    assertTargetBound(target: object, op: "draw" | "batch-draw" | "blit" | "clear"): void;
    /**
     * Assert that the currently bound command is the same one as the
     * parameter.
     */
    assertCommandBound(command: object, op: "batch-draw"): void;
    /**
     * Assert that it is safe to bind a target (no other target would
     * be overwritten).
     */
    assertTargetSafeToBind(): void;
    /**
     * Assert that it is safe to bind a command (no other command
     * would be overwritten).
     */
    assertCommandSafeToBind(): void;
    /**
     * Reset all knowledge and assumptions about current state. Can't
     * be used while a resource is bound.
     */
    reset(): void;
    private applyDepthTest;
    private applyStencilTest;
    private applyBlend;
}
export declare class DepthTestDescriptor {
    readonly func: number;
    readonly mask: boolean;
    readonly rangeStart: number;
    readonly rangeEnd: number;
    static equals(left: DepthTestDescriptor | null, right: DepthTestDescriptor | null): boolean;
    constructor(func: number, mask: boolean, rangeStart: number, rangeEnd: number);
}
export declare class StencilTestDescriptor {
    readonly fFn: number;
    readonly bFn: number;
    readonly fFnRef: number;
    readonly bFnRef: number;
    readonly fFnMask: number;
    readonly bFnMask: number;
    readonly fMask: number;
    readonly bMask: number;
    readonly fOpFail: number;
    readonly bOpFail: number;
    readonly fOpZFail: number;
    readonly bOpZFail: number;
    readonly fOpZPass: number;
    readonly bOpZPass: number;
    static equals(left: StencilTestDescriptor | null, right: StencilTestDescriptor | null): boolean;
    constructor(fFn: number, bFn: number, fFnRef: number, bFnRef: number, fFnMask: number, bFnMask: number, fMask: number, bMask: number, fOpFail: number, bOpFail: number, fOpZFail: number, bOpZFail: number, fOpZPass: number, bOpZPass: number);
}
export declare class BlendDescriptor {
    readonly srcRGB: number;
    readonly srcAlpha: number;
    readonly dstRGB: number;
    readonly dstAlpha: number;
    readonly eqnRGB: number;
    readonly eqnAlpha: number;
    readonly color?: [number, number, number, number] | undefined;
    static equals(left: BlendDescriptor | null, right: BlendDescriptor | null): boolean;
    constructor(srcRGB: number, srcAlpha: number, dstRGB: number, dstAlpha: number, eqnRGB: number, eqnAlpha: number, color?: [number, number, number, number] | undefined);
}
//# sourceMappingURL=state.d.ts.map