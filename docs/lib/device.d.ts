/// <reference types="webgl2" />
import { Stack } from "./util/stack";
import { Target } from "./target";
import { DepthDescriptor, StencilDescriptor, BlendDescriptor } from "./command";
export interface DeviceCreateOptions {
    element?: HTMLElement;
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    preserveDrawingBuffer?: boolean;
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}
export interface DeviceWithCanvasOptions {
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    preserveDrawingBuffer?: boolean;
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}
export interface DeviceWithContextOptions {
    extensions?: Extension[];
    debug?: boolean;
    pixelRatio?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}
/**
 * Available extensions.
 */
export declare enum Extension {
    EXTColorBufferFloat = "EXT_color_buffer_float",
    OESTextureFloatLinear = "OES_texture_float_linear"
}
export declare class Device {
    /**
     * Create a new canvas and device (containing a gl context). Mount it on
     * `element` parameter (default is `document.body`).
     */
    static create(options?: DeviceCreateOptions): Device;
    /**
     * Create a new device from existing canvas. Does not take ownership of
     * canvas.
     */
    static withCanvas(canvas: HTMLCanvasElement, options?: DeviceWithCanvasOptions): Device;
    /**
     * Create a new device from existing gl context. Does not take ownership of
     * context, but concurrent usage of voids the warranty. Only use
     * concurrently when absolutely necessary.
     */
    static withContext(gl: WebGL2RenderingContext, { pixelRatio, viewportWidth, viewportHeight, extensions, debug, }?: DeviceWithContextOptions): Device;
    readonly _gl: WebGL2RenderingContext;
    readonly _canvas: HTMLCanvasElement;
    readonly _stackProgram: Stack<WebGLProgram | null>;
    readonly _stackDepthTest: Stack<DepthDescriptor | null>;
    readonly _stackStencilTest: Stack<StencilDescriptor | null>;
    readonly _stackBlend: Stack<BlendDescriptor | null>;
    private explicitPixelRatio?;
    private explicitViewportWidth?;
    private explicitViewportHeight?;
    private backbufferTarget;
    private constructor();
    /**
     * Return width of the gl drawing buffer.
     */
    readonly bufferWidth: number;
    /**
     * Return height of the gl drawing buffer.
     */
    readonly bufferHeight: number;
    /**
     * Return width of the canvas. This will usually be the same as:
     *   device.bufferWidth
     */
    readonly canvasWidth: number;
    /**
     * Return height of the canvas. This will usually be the same as:
     *   device.bufferHeight
     */
    readonly canvasHeight: number;
    /**
     * Return width of canvas in CSS pixels (before applying device pixel ratio)
     */
    readonly canvasCSSWidth: number;
    /**
     * Return height of canvas in CSS pixels (before applying device pixel ratio)
     */
    readonly canvasCSSHeight: number;
    /**
     * Return the device pixel ratio for this device
     */
    readonly pixelRatio: number;
    /**
     * Notify the device to check whether updates are needed. This resizes the
     * canvas, if the device pixel ratio or css canvas width/height changed.
     */
    update(): void;
    /**
     * Request a render target from the device to draw into. This gives you the
     * gl.BACK target.
     *
     * Drawing should be done within the callback by
     * calling `target.clear()` or `target.draw()` family of methods.
     *
     * Also see `framebuffer.target()`.
     */
    target(cb: (rt: Target) => void): void;
}
//# sourceMappingURL=device.d.ts.map