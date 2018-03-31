/**
 * Possible buffer targets to operate on.
 */
export declare enum BufferBits {
    COLOR = 16384,
    DEPTH = 256,
    STENCIL = 1024,
    COLOR_DEPTH = 16640,
    COLOR_STENCIL = 17408,
    DEPTH_STENCIL = 1280,
    COLOR_DEPTH_STENCIL = 17664,
}
/**
 * Possible buffer usage.
 */
export declare enum BufferUsage {
    STATIC_DRAW = 35044,
    DYNAMIC_DRAW = 35048,
    STREAM_DRAW = 35040,
    STATIC_READ = 35045,
    DYNAMIC_READ = 35049,
    STREAM_READ = 35041,
    STATIC_COPY = 35046,
    DYNAMIC_COPY = 35050,
    STREAM_COPY = 35042,
}
/**
 * Possible data types.
 */
export declare enum DataType {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    INT = 5124,
    UNSIGNED_INT = 5125,
    FLOAT = 5126,
    HALF_FLOAT = 5131,
    UNSIGNED_INT_24_8 = 34042,
    FLOAT_32_UNSIGNED_INT_24_8_REV = 36269,
}
/**
 * Drawing primitives.
 */
export declare enum Primitive {
    POINTS = 0,
    LINES = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3,
    TRIANGLES = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6,
}
export declare function sizeOf(type: DataType): number;
