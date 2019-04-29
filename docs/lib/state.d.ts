/// <reference types="webgl2" />
/**
 * A thin layer on top of WebGL remembering the current state, only
 * setting the actual WebGL state when needed.
 *
 * `State` contains locks and state bits. Locks represent an ongoing
 * usage session with a resource. While a resource is locked, all the
 * state bits set when locking are expected to still be in place. Any
 * attempt to set those state bits while the lock is held is
 * considered an error.
 */
export declare class State {
    readonly gl: WebGL2RenderingContext;
    private lockedTarget;
    private lockedCommand;
    private glDrawFramebuffer;
    private glDrawBuffers;
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
     * Lock a `Target` for this `State`. Compare the underlying
     * framebuffer and draw buffers and only set them if needed.
     *
     * Each `Device` must have at most one `Target` locked at any
     * time. Nested binding is not supported even though it is not
     * prohibited by the shape of the API:
     *
     * ```typescript
     * // This produces a runtime error
     * fbo.target((fbort) => {
     *     dev.target((rt) => rt.draw(...));
     *     fbort.draw(...);
     * });
     * ```
     */
    lockTarget(target: object, glDrawFramebuffer: WebGLFramebuffer | null, glDrawBuffers: number[]): void;
    /**
     * Unlock the currently locked target. Does not unbind the
     * framebuffer nor the draw buffers, expecting they will be
     * conditionally bound in the next call to `State.lockTarget()`.
     *
     * Errors if the target is `null` already, as it indicates a usage
     * bug.
     */
    unlockTarget(): void;
    /**
     * Lock a `Command` for this `State`. Compare the underlying
     * program and only set it if needed.
     *
     * Each `Device` must have at most one `Command` locked at any
     * time. Nested binding is not supported even though it is not
     * prohibited by the shape of the API:
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
    lockCommand(command: object, glProgram: WebGLProgram | null): void;
    /**
     * Unlock the currently locked command. Does not unbind the
     * program, expecting it will be conditionally bound in the next
     * call to `State.lockCommand()`.
     *
     * Errors if `lockedCommand` is `null` already, as it indicates a
     * usage bug.
     */
    unlockCommand(): void;
    /**
     * Return whether the currently locked Target is the same as the
     * parameter.
     */
    isTargetLocked(target: object): boolean;
    /**
     * Return whether the currently locked Command is the same as the
     * parameter.
     */
    isCommandLocked(command: object): boolean;
    /**
     * Return whether there is no Target currently locked.
     */
    isTargetUnlocked(): boolean;
    /**
     * Return whether there is no Command currently locked.
     */
    isCommandUnlocked(): boolean;
    /**
     * Reset all knowledge and assumptions about current state. Can't
     * be used while a resource is locked.
     */
    reset(): void;
}
export declare class DepthTestDescriptor {
    readonly func: number;
    readonly mask: boolean;
    readonly rangeStart: number;
    readonly rangeEnd: number;
    static equals(left: DepthTestDescriptor | null | undefined, right: DepthTestDescriptor | null | undefined): boolean;
    constructor(func: number, mask: boolean, rangeStart: number, rangeEnd: number);
}
export declare class StencilTestDescriptor {
    readonly frontFunc: number;
    readonly backFunc: number;
    readonly frontFuncRef: number;
    readonly backFuncRef: number;
    readonly frontFuncMask: number;
    readonly backFuncMask: number;
    readonly frontMask: number;
    readonly backMask: number;
    readonly frontOpFail: number;
    readonly backOpFail: number;
    readonly frontOpZFail: number;
    readonly backOpZFail: number;
    readonly frontOpZPass: number;
    readonly backOpZPass: number;
    static equals(left: StencilTestDescriptor | null | undefined, right: StencilTestDescriptor | null | undefined): boolean;
    constructor(frontFunc: number, backFunc: number, frontFuncRef: number, backFuncRef: number, frontFuncMask: number, backFuncMask: number, frontMask: number, backMask: number, frontOpFail: number, backOpFail: number, frontOpZFail: number, backOpZFail: number, frontOpZPass: number, backOpZPass: number);
}
export declare class BlendDescriptor {
    readonly srcRGB: number;
    readonly srcAlpha: number;
    readonly dstRGB: number;
    readonly dstAlpha: number;
    readonly eqnRGB: number;
    readonly eqnAlpha: number;
    readonly color?: [number, number, number, number] | undefined;
    static equals(left: BlendDescriptor | null | undefined, right: BlendDescriptor | null | undefined): boolean;
    constructor(srcRGB: number, srcAlpha: number, dstRGB: number, dstAlpha: number, eqnRGB: number, eqnAlpha: number, color?: [number, number, number, number] | undefined);
}
//# sourceMappingURL=state.d.ts.map