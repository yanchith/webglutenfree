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
    COLOR_DEPTH_STENCIL = 17664
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
    STREAM_COPY = 35042
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
    TRIANGLE_FAN = 6
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
    FLOAT_32_UNSIGNED_INT_24_8_REV = 36269
}
export declare enum InternalFormat {
    R8 = 33321,
    R8_SNORM = 36756,
    R8UI = 33330,
    R8I = 33329,
    R16UI = 33332,
    R16I = 33331,
    R32UI = 33334,
    R32I = 33333,
    R16F = 33325,
    R32F = 33326,
    RG8 = 33323,
    RG8_SNORM = 36757,
    RG8UI = 33336,
    RG8I = 33335,
    RG16UI = 33338,
    RG16I = 33337,
    RG32UI = 33340,
    RG32I = 33339,
    RG16F = 33327,
    RG32F = 33328,
    RGB8 = 32849,
    RGB8_SNORM = 36758,
    RGB8UI = 36221,
    RGB8I = 36239,
    RGB16UI = 36215,
    RGB16I = 36233,
    RGB32UI = 36209,
    RGB32I = 36227,
    RGB16F = 34843,
    RGB32F = 34837,
    RGBA8 = 32856,
    RGBA8_SNORM = 36759,
    RGBA8UI = 36220,
    RGBA8I = 36238,
    RGBA16UI = 36214,
    RGBA16I = 36232,
    RGBA32UI = 36208,
    RGBA32I = 36226,
    RGBA16F = 34842,
    RGBA32F = 34836,
    DEPTH_COMPONENT16 = 33189,
    DEPTH_COMPONENT24 = 33190,
    DEPTH_COMPONENT32F = 36012,
    DEPTH24_STENCIL8 = 35056,
    DEPTH32F_STENCIL8 = 36013
}
export declare enum Format {
    RED = 6403,
    RG = 33319,
    RGB = 6407,
    RGBA = 6408,
    RED_INTEGER = 36244,
    RG_INTEGER = 33320,
    RGB_INTEGER = 36248,
    RGBA_INTEGER = 36249,
    DEPTH_COMPONENT = 6402,
    DEPTH_STENCIL = 34041
}
export declare enum Filter {
    NEAREST = 9728,
    LINEAR = 9729,
    NEAREST_MIPMAP_NEAREST = 9984,
    LINEAR_MIPMAP_NEAREST = 9985,
    NEAREST_MIPMAP_LINEAR = 9986,
    LINEAR_MIPMAP_LINEAR = 9987
}
export declare enum Wrap {
    CLAMP_TO_EDGE = 33071,
    REPEAT = 10497,
    MIRRORED_REPEAT = 33648
}
/**
 * Possible data types.
 */
export declare enum UniformType {
    FLOAT = 5126,
    FLOAT_VEC2 = 35664,
    FLOAT_VEC3 = 35665,
    FLOAT_VEC4 = 35666,
    INT = 5124,
    INT_VEC2 = 35667,
    INT_VEC3 = 35668,
    INT_VEC4 = 35669,
    UNSIGNED_INT = 5125,
    UNSIGNED_INT_VEC2 = 36294,
    UNSIGNED_INT_VEC3 = 36295,
    UNSIGNED_INT_VEC4 = 36296,
    FLOAT_MAT2 = 35674,
    FLOAT_MAT3 = 35675,
    FLOAT_MAT4 = 35676,
    SAMPLER_2D = 35678,
    SAMPLER_CUBE = 35680
}
export declare function sizeOf(type: DataType): number;
