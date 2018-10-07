/// <reference types="webgl2" />
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
export declare class State {
    readonly gl: WebGL2RenderingContext;
    private target;
    private command;
    private glProgram;
    private glDrawFramebuffer;
    private glDrawBuffers;
    private depthTest;
    private stencilTest;
    private blend;
    constructor(gl: WebGL2RenderingContext);
    setDepthTest(depthTest: DepthTestDescriptor | null): void;
    setStencilTest(stencilTest: StencilTestDescriptor | null): void;
    setBlend(blend: BlendDescriptor | null): void;
    /**
     * Bind a `Target` for this `State`. Each `Device` must have at
     * most one `Target` bound at any time. Nested target binding is not
     * supported even though it is not prohibited by the shape of the API:
     *
     * // This produces a runtime error
     * fbo.target((fbort) => {
     *     dev.target((rt) => rt.draw(...));
     *     fbort.draw(...);
     * });
     */
    bindTarget(target: object, glDrawFramebuffer: WebGLFramebuffer | null, glDrawBuffers: number[]): void;
    /**
     * Unbind currently bound target. Only forgets the target from `State`,
     * does not unbind the WebGL framebuffer.
     */
    unbindTarget(): void;
    /**
     * Bind a `Command` for this `State`. Each `Device` must have at
     * most one `Command` bound at any time. Nested command binding is not
     * supported even though it is not prohibited by the shape of the API:
     *
     * // This produces a runtime error
     * dev.target((rt) => {
     *     rt.batch(cmd, (draw) => {
     *         rt.draw(cmd, attrs, props);
     *     });
     * });
     */
    bindCommand(command: object, glProgram: WebGLProgram | null): void;
    /**
     * Unbind currently bound command. Only forgets the command from `State`,
     * does not unbind the WebGL program.
     */
    unbindCommand(): void;
    assertTargetBound(target: object, op: "draw" | "batch-draw" | "blit" | "clear"): void;
    assertCommandBound(command: object, op: "batch-draw"): void;
    assertTargetUnbound(): void;
    assertCommandUnbound(): void;
    private applyDepthTest;
    private applyStencilTest;
    private applyBlend;
}
//# sourceMappingURL=state.d.ts.map