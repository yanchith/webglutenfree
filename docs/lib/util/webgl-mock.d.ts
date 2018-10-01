interface Canvas {
    width: number;
    height: number;
    clientWidth: number;
    clientHeight: number;
}
export declare class WebGL2RenderingContextMock {
    canvas: Canvas;
    drawingBufferWidth: number;
    drawingBufferHeight: number;
    constructor(canvas: Canvas);
    getExtension(_: string): unknown;
}
export {};
//# sourceMappingURL=webgl-mock.d.ts.map