import * as assert from "./util/assert";


/**
 * Possible buffer targets to operate on.
 */
export enum BufferBits {
    COLOR = 0x00004000,
    DEPTH = 0x00000100,
    STENCIL = 0x00000400,
    COLOR_DEPTH = COLOR | DEPTH,
    COLOR_STENCIL = COLOR | STENCIL,
    DEPTH_STENCIL = DEPTH | STENCIL,
    COLOR_DEPTH_STENCIL = COLOR | DEPTH | STENCIL,
}

/**
 * Possible buffer usage.
 */
export enum BufferUsage {
    STATIC_DRAW = 0x88E4,
    DYNAMIC_DRAW = 0x88E8,
    STREAM_DRAW = 0x88E0,
    STATIC_READ = 0x88E5,
    DYNAMIC_READ = 0x88E9,
    STREAM_READ = 0x88E1,
    STATIC_COPY = 0x88E6,
    DYNAMIC_COPY = 0x88EA,
    STREAM_COPY = 0x88E2,
}

/**
 * Possible data types.
 */
export enum DataType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,
}

/**
 * Drawing primitives.
 */
export enum Primitive {
    POINTS = 0x0000,
    LINES = 0x0001,
    LINE_LOOP = 0x0002,
    LINE_STRIP = 0x0003,
    TRIANGLES = 0x0004,
    TRIANGLE_STRIP = 0x0005,
    TRIANGLE_FAN = 0x0006,
}

export function toByteLength(length: number, type: DataType): number {
    switch (type) {
        case DataType.BYTE:
        case DataType.UNSIGNED_BYTE:
            return length;
        case DataType.SHORT:
        case DataType.UNSIGNED_SHORT:
            return length * 2;
        case DataType.INT:
        case DataType.UNSIGNED_INT:
        case DataType.FLOAT:
            return length * 4;
        default: return assert.never(type);
    }
}
