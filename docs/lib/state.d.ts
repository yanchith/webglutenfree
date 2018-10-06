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
    private depthTest;
    private stencilTest;
    private blend;
    private target;
    private command;
    constructor(gl: WebGL2RenderingContext);
    setDepthTest(depthTest: DepthTestDescriptor | null): void;
    setStencilTest(stencilTest: StencilTestDescriptor | null): void;
    setBlend(blend: BlendDescriptor | null): void;
    /**
     * Tracks binding of `Target`s for this `State`. Each `Device` must have at
     * most one `Target` bound at any time. Nested target binding is not
     * supported even though it is not prohibited by the shape of the API:
     *
     * // This produces a runtime error
     * fbo.target((fbort) => {
     *     dev.target((rt) => rt.draw(...));
     *     fbort.draw(...);
     * });
     */
    trackTargetBinding(target: object | null): void;
    /**
     * Tracks binding of `Command`s for this `State`. Each `Device` must have at
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
    trackCommandBinding(command: object | null): void;
    assertTargetBound(op: "draw" | "batch-draw" | "blit" | "clear"): void;
    assertCommandBound(op: "batch-draw"): void;
    assertTargetUnbound(): void;
    assertCommandUnbound(): void;
    private applyDepthTest;
    private applyStencilTest;
    private applyBlend;
}
//# sourceMappingURL=state.d.ts.map