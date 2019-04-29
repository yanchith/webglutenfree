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
export class State {

    readonly gl: WebGL2RenderingContext;

    private lockedTarget: object | null = null;
    private lockedCommand: object | null = null;

    // Each bit of state can also be `undefined`, meaning "we don't
    // know". This will cause the comparison to fail and we will issue
    // a state transition to ensure the value is what we need it to
    // be. This happens for new `State`s, and after `state.reset()` is
    // called. To preserve some sanity, we disallow calling
    // `state.reset()` if we currently have any resource locked (we
    // are in the middle of a rendering session).

    private glDrawFramebuffer: object | null | undefined = undefined;
    private glDrawBuffers: number[] | undefined = undefined;
    private glProgram: WebGLProgram | null | undefined = undefined;

    private depthTest: DepthTestDescriptor | null | undefined = undefined;
    private stencilTest: StencilTestDescriptor | null | undefined = undefined;
    private blend: BlendDescriptor | null | undefined = undefined;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    /**
     * Set the depth test strategy if it differs from the current one.
     */
    setDepthTest(depthTest: DepthTestDescriptor | null): void {
        if (!DepthTestDescriptor.equals(this.depthTest, depthTest)) {
            const gl = this.gl;

            if (depthTest) {
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(depthTest.func);
                gl.depthMask(depthTest.mask);
                gl.depthRange(depthTest.rangeStart, depthTest.rangeEnd);
            } else {
                gl.disable(gl.DEPTH_TEST);
            }

            this.depthTest = depthTest;
        }
    }

    /**
     * Set the stencil test strategy if it differs from the current
     * one.
     */
    setStencilTest(stencilTest: StencilTestDescriptor | null): void {
        if (!StencilTestDescriptor.equals(this.stencilTest, stencilTest)) {
            const gl = this.gl;

            if (stencilTest) {
                const {
                    frontFunc,
                    backFunc,
                    frontFuncRef,
                    backFuncRef,
                    frontFuncMask,
                    backFuncMask,
                    frontMask,
                    backMask,
                    frontOpFail,
                    backOpFail,
                    frontOpZFail,
                    backOpZFail,
                    frontOpZPass,
                    backOpZPass,
                } = stencilTest;
                gl.enable(gl.STENCIL_TEST);
                gl.stencilFuncSeparate(
                    gl.FRONT,
                    frontFunc,
                    frontFuncRef,
                    frontFuncMask,
                );
                gl.stencilFuncSeparate(
                    gl.BACK,
                    backFunc,
                    backFuncRef,
                    backFuncMask,
                );
                gl.stencilMaskSeparate(gl.FRONT, frontMask);
                gl.stencilMaskSeparate(gl.BACK, backMask);
                gl.stencilOpSeparate(
                    gl.FRONT,
                    frontOpFail,
                    frontOpZFail,
                    frontOpZPass,
                );
                gl.stencilOpSeparate(
                    gl.BACK,
                    backOpFail,
                    backOpZFail,
                    backOpZPass,
                );
            } else {
                gl.disable(gl.STENCIL_TEST);
            }

            this.stencilTest = stencilTest;
        }
    }

    /**
     * Set the blending strategy if it differs from the current one.
     */
    setBlend(blend: BlendDescriptor | null): void {
        if (!BlendDescriptor.equals(this.blend, blend)) {
            const gl = this.gl;

            if (blend) {
                gl.enable(gl.BLEND);
                gl.blendFuncSeparate(
                    blend.srcRGB,
                    blend.dstRGB,
                    blend.srcAlpha,
                    blend.dstAlpha,
                );
                gl.blendEquationSeparate(
                    blend.eqnRGB,
                    blend.eqnAlpha,
                );
                if (blend.color) {
                    const [r, g, b, a] = blend.color;
                    gl.blendColor(r, g, b, a);
                }
            } else {
                gl.disable(gl.BLEND);
            }

            this.blend = blend;
        }
    }

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
    lockTarget(
        target: object,
        glDrawFramebuffer: WebGLFramebuffer | null,
        glDrawBuffers: number[],
    ): void {
        if (this.lockedTarget) {
            throw new Error("Cannot lock Target, already locked");
        }

        const gl = this.gl;
        if (this.glDrawFramebuffer !== glDrawFramebuffer) {
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, glDrawFramebuffer);
            this.glDrawFramebuffer = glDrawFramebuffer;
        }
        if (typeof this.glDrawBuffers === "undefined"
            || !arrayEquals(this.glDrawBuffers, glDrawBuffers)) {

            gl.drawBuffers(glDrawBuffers);
            this.glDrawBuffers = glDrawBuffers;
        }

        this.lockedTarget = target;
    }

    /**
     * Unlock the currently locked target. Does not unbind the
     * framebuffer nor the draw buffers, expecting they will be
     * conditionally bound in the next call to `State.lockTarget()`.
     *
     * Errors if the target is `null` already, as it indicates a usage
     * bug.
     */
    unlockTarget(): void {
        if (!this.lockedTarget) {
            throw new Error("Cannot unlock Target, not locked");
        }

        this.lockedTarget = null;
    }

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
    lockCommand(command: object, glProgram: WebGLProgram | null): void {
        if (this.lockedCommand) {
            throw new Error("Cannot lock Command, already locked");
        }

        if (this.glProgram !== glProgram) {
            this.gl.useProgram(glProgram);
            this.glProgram = glProgram;
        }

        this.lockedCommand = command;
    }

    /**
     * Unlock the currently locked command. Does not unbind the
     * program, expecting it will be conditionally bound in the next
     * call to `State.lockCommand()`.
     *
     * Errors if `lockedCommand` is `null` already, as it indicates a
     * usage bug.
     */
    unlockCommand(): void {
        if (!this.lockedCommand) {
            throw new Error("Cannot unlock Command, not locked");
        }

        this.lockedCommand = null;
    }

    /**
     * Return whether the currently locked Target is the same as the
     * parameter.
     */
    isTargetLocked(target: object): boolean {
        return this.lockedTarget === target;
    }

    /**
     * Return whether the currently locked Command is the same as the
     * parameter.
     */
    isCommandLocked(command: object): boolean {
        return this.lockedCommand === command;
    }

    /**
     * Return whether there is no Target currently locked.
     */
    isTargetUnlocked(): boolean {
        return this.lockedTarget === null;
    }

    /**
     * Return whether there is no Command currently locked.
     */
    isCommandUnlocked(): boolean {
        return this.lockedCommand === null;
    }

    /**
     * Reset all knowledge and assumptions about current state. Can't
     * be used while a resource is locked.
     */
    reset(): void {
        if (this.lockedTarget) {
            throw new Error("Cannot reset when Target is locked");
        }

        if (this.lockedCommand) {
            throw new Error("Cannot reset when Command is locked");
        }

        this.lockedTarget  = null;
        this.lockedCommand  = null;

        this.glDrawFramebuffer = undefined;
        this.glDrawBuffers = undefined;
        this.glProgram = undefined;

        this.depthTest = undefined;
        this.stencilTest = undefined;
        this.blend = undefined;
    }
}

export class DepthTestDescriptor {
    static equals(
        left: DepthTestDescriptor | null | undefined,
        right: DepthTestDescriptor | null | undefined,
    ): boolean {
        if (left === right) { return true; }
        if (!left || !right) { return false; }
        if (left.func !== right.func) { return false; }
        if (left.mask !== right.mask) { return false; }
        if (left.rangeStart !== right.rangeStart) { return false; }
        if (left.rangeEnd !== right.rangeEnd) { return false; }
        return true;
    }

    constructor(
        readonly func: number,
        readonly mask: boolean,
        readonly rangeStart: number,
        readonly rangeEnd: number,
    ) { }
}

export class StencilTestDescriptor {
    static equals(
        left: StencilTestDescriptor | null | undefined,
        right: StencilTestDescriptor | null | undefined,
    ): boolean {
        if (left === right) { return true; }
        if (!left || !right) { return false; }
        if (left.frontFunc !== right.frontFunc) { return false; }
        if (left.backFunc !== right.backFunc) { return false; }
        if (left.frontFuncRef !== right.frontFuncRef) { return false; }
        if (left.backFuncRef !== right.backFuncRef) { return false; }
        if (left.frontFuncMask !== right.frontFuncMask) { return false; }
        if (left.backFuncMask !== right.backFuncMask) { return false; }
        if (left.frontMask !== right.frontMask) { return false; }
        if (left.backMask !== right.backMask) { return false; }
        if (left.frontOpFail !== right.frontOpFail) { return false; }
        if (left.backOpFail !== right.backOpFail) { return false; }
        if (left.frontOpZFail !== right.frontOpZFail) { return false; }
        if (left.backOpZFail !== right.backOpZFail) { return false; }
        if (left.frontOpZPass !== right.frontOpZPass) { return false; }
        if (left.backOpZPass !== right.backOpZPass) { return false; }
        return true;
    }

    constructor(
        readonly frontFunc: number,
        readonly backFunc: number,
        readonly frontFuncRef: number,
        readonly backFuncRef: number,
        readonly frontFuncMask: number,
        readonly backFuncMask: number,
        readonly frontMask: number,
        readonly backMask: number,
        readonly frontOpFail: number,
        readonly backOpFail: number,
        readonly frontOpZFail: number,
        readonly backOpZFail: number,
        readonly frontOpZPass: number,
        readonly backOpZPass: number,
    ) { }
}

export class BlendDescriptor {
    static equals(
        left: BlendDescriptor | null | undefined,
        right: BlendDescriptor | null | undefined,
    ): boolean {
        if (left === right) { return true; }
        if (!left || !right) { return false; }
        if (left.srcRGB !== right.srcRGB) { return false; }
        if (left.srcAlpha !== right.srcAlpha) { return false; }
        if (left.dstRGB !== right.dstRGB) { return false; }
        if (left.dstAlpha !== right.dstAlpha) { return false; }
        if (left.eqnRGB !== right.eqnRGB) { return false; }
        if (left.eqnAlpha !== right.eqnAlpha) { return false; }
        if (left.color === right.color) { return true; }
        if (!left.color || !right.color) { return false; }
        if (left.color[0] !== right.color[0]) { return false; }
        if (left.color[1] !== right.color[1]) { return false; }
        if (left.color[2] !== right.color[2]) { return false; }
        if (left.color[3] !== right.color[3]) { return false; }
        return true;
    }

    constructor(
        readonly srcRGB: number,
        readonly srcAlpha: number,
        readonly dstRGB: number,
        readonly dstAlpha: number,
        readonly eqnRGB: number,
        readonly eqnAlpha: number,
        readonly color?: [number, number, number, number],
    ) { }
}

function arrayEquals(left: number[], right: number[]): boolean {
    if (left.length !== right.length) {
        return false;
    }

    for (let i = 0; i < left.length; ++i) {
        if (left[i] !== right[i]) {
            return false;
        }
    }

    return true;
}
