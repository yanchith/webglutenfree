import { State } from "./state";
import { Command } from "./command";
import { Attributes } from "./attributes";
import { Framebuffer } from "./framebuffer";
export declare const enum TargetBufferBitmask {
    COLOR = 16384,
    DEPTH = 256,
    STENCIL = 1024,
    COLOR_DEPTH = 16640,
    COLOR_STENCIL = 17408,
    DEPTH_STENCIL = 1280,
    COLOR_DEPTH_STENCIL = 17664
}
export declare const enum TargetBlitFilter {
    NEAREST = 9728,
    LINEAR = 9729
}
export interface TargetClearOptions {
    r?: number;
    g?: number;
    b?: number;
    a?: number;
    depth?: number;
    stencil?: number;
    scissorX?: number;
    scissorY?: number;
    scissorWidth?: number;
    scissorHeight?: number;
}
export interface TargetBlitOptions {
    srcX?: number;
    srcY?: number;
    srcWidth?: number;
    srcHeight?: number;
    dstX?: number;
    dstY?: number;
    dstWidth?: number;
    dstHeight?: number;
    filter?: TargetBlitFilter;
    scissorX?: number;
    scissorY?: number;
    scissorWidth?: number;
    scissorHeight?: number;
}
export interface TargetDrawOptions {
    viewportX?: number;
    viewportY?: number;
    viewportWidth?: number;
    viewportHeight?: number;
    scissorX?: number;
    scissorY?: number;
    scissorWidth?: number;
    scissorHeight?: number;
}
/**
 * Target represents a drawable surface. Get hold of targets with
 * `device.target()` or `framebuffer.target()`.
 */
export declare class Target {
    private state;
    private glDrawBuffers;
    private glFramebuffer;
    private surfaceWidth?;
    private surfaceHeight?;
    constructor(state: State, glDrawBuffers: number[], glFramebuffer: WebGLFramebuffer | null, surfaceWidth?: number | undefined, surfaceHeight?: number | undefined);
    /**
     * Run the callback with the target bound. This is called automatically,
     * when obtaining a target via `device.target()` or `framebuffer.target()`.
     *
     * All writes/drawing to the target MUST be done within the callback.
     */
    with(cb: (rt: Target) => void): void;
    /**
     * Clear selected buffers to provided values.
     */
    clear(bits: TargetBufferBitmask, { r, g, b, a, depth, stencil, scissorX, scissorY, scissorWidth, scissorHeight, }?: TargetClearOptions): void;
    /**
     * Blit source framebuffer onto this render target. Use buffer bits to
     * choose buffers to blit.
     */
    blit(source: Framebuffer, bits: TargetBufferBitmask, { srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, filter, scissorX, scissorY, scissorWidth, scissorHeight, }?: TargetBlitOptions): void;
    /**
     * Draw to this target with a void command and attributes.
     */
    draw(cmd: Command<void> | Command<undefined>, attrs: Attributes): void;
    /**
     * Draw to this target with a command, attributes, and command properties.
     * The properties are passed to the command's uniform or texture callbacks,
     * if used.
     */
    draw<P>(cmd: Command<P>, attrs: Attributes, props: P, opts?: TargetDrawOptions): void;
    /**
     * Perform multiple draws to this target with the same command, but multiple
     * attributes and command properties. The properties are passed to the
     * command's uniform or texture callbacks, if used.
     *
     * All drawing should be performed within the callback to prevent
     * unnecesasry rebinding.
     */
    batch<P>(cmd: Command<P>, cb: (draw: (attrs: Attributes, props: P) => void) => void, { viewportX, viewportY, viewportWidth, viewportHeight, scissorX, scissorY, scissorWidth, scissorHeight, }?: TargetDrawOptions): void;
    private drawArrays;
    private drawElements;
    private textures;
    private uniforms;
}
//# sourceMappingURL=target.d.ts.map