/// <reference types="webgl2" />

export interface DeviceOptions {
	antialias?: boolean;
	enableEXTColorBufferFloat?: boolean;
	enableOESTextureFloatLinear?: boolean;
}
export declare class Device {
	readonly gl: WebGL2RenderingContext;
	readonly extColorBufferFloat: object | undefined;
	readonly oesTextureFloatLinear: OES_texture_float_linear | undefined;
	static createAndMount(element?: HTMLElement, options?: DeviceOptions): Device;
	static fromCanvas(canvas: HTMLCanvasElement, options?: DeviceOptions): Device;
	static fromContext(gl: WebGL2RenderingContext, {enableEXTColorBufferFloat, enableOESTextureFloatLinear}?: DeviceOptions): Device;
	private constructor();
	readonly bufferWidth: number;
	readonly bufferHeight: number;
	readonly canvasWidth: number;
	readonly canvasHeight: number;
	updateCanvas(): void;
}
export declare type VertexBufferType = VertexBufferProps["type"];
export declare type VertexBufferProps = VertexBufferInt8Props | VertexBufferInt16Props | VertexBufferInt32Props | VertexBufferUint8Props | VertexBufferUint16Props | VertexBufferUint32Props | VertexBufferFloat32Props;
export interface VertexBufferInt8Props {
	type: "i8";
	data: number[] | Int8Array;
}
export interface VertexBufferInt16Props {
	type: "i16";
	data: number[] | Int16Array;
}
export interface VertexBufferInt32Props {
	type: "i32";
	data: number[] | Int32Array;
}
export interface VertexBufferUint8Props {
	type: "u8";
	data: number[] | Uint8Array | Uint8ClampedArray;
}
export interface VertexBufferUint16Props {
	type: "u16";
	data: number[] | Uint16Array;
}
export interface VertexBufferUint32Props {
	type: "u32";
	data: number[] | Uint32Array;
}
export interface VertexBufferFloat32Props {
	type: "f32";
	data: number[] | Float32Array;
}
export declare class VertexBuffer<T extends VertexBufferType = VertexBufferType> {
	static create(dev: WebGL2RenderingContext | Device, props: VertexBufferInt8Props): VertexBuffer<"i8">;
	static create(dev: WebGL2RenderingContext | Device, props: VertexBufferInt16Props): VertexBuffer<"i16">;
	static create(dev: WebGL2RenderingContext | Device, props: VertexBufferInt32Props): VertexBuffer<"i32">;
	static create(dev: WebGL2RenderingContext | Device, props: VertexBufferUint8Props): VertexBuffer<"u8">;
	static create(dev: WebGL2RenderingContext | Device, props: VertexBufferUint16Props): VertexBuffer<"u16">;
	static create(dev: WebGL2RenderingContext | Device, props: VertexBufferUint32Props): VertexBuffer<"u32">;
	static create(dev: WebGL2RenderingContext | Device, props: VertexBufferFloat32Props): VertexBuffer<"f32">;
	static fromInt8Array(dev: WebGL2RenderingContext | Device, data: number[] | Int8Array): VertexBuffer<"i8">;
	static fromInt16Array(dev: WebGL2RenderingContext | Device, data: number[] | Int16Array): VertexBuffer<"i16">;
	static fromInt32Array(dev: WebGL2RenderingContext | Device, data: number[] | Int32Array): VertexBuffer<"i32">;
	static fromUint8Array(dev: WebGL2RenderingContext | Device, data: number[] | Uint8Array | Uint8ClampedArray): VertexBuffer<"u8">;
	static fromUint16Array(dev: WebGL2RenderingContext | Device, data: number[] | Uint16Array): VertexBuffer<"u16">;
	static fromUint32Array(dev: WebGL2RenderingContext | Device, data: number[] | Uint32Array): VertexBuffer<"u32">;
	static fromFloat32Array(dev: WebGL2RenderingContext | Device, data: number[] | Float32Array): VertexBuffer<"f32">;
	readonly gl: WebGL2RenderingContext;
	readonly type: T;
	readonly glType: number;
	readonly glBuffer: WebGLBuffer;
	private constructor();
}
export declare type ElementBufferProps = ElementBufferArrayProps | ElementBufferObjectProps;
export interface ElementBufferObjectProps {
	type: "u32";
	data: number[] | Uint32Array;
}
export declare type ElementBufferArrayProps = number[] | [number, number][] | [number, number, number][];
export declare class ElementBuffer {
	readonly glBuffer: WebGLBuffer;
	readonly count: number;
	static create(dev: WebGL2RenderingContext | Device, props: ElementBufferProps): ElementBuffer;
	static fromArray(dev: WebGL2RenderingContext | Device, data: ElementBufferArrayProps): ElementBuffer;
	static fromUint32Array(dev: WebGL2RenderingContext | Device, data: number[] | Uint32Array): ElementBuffer;
	private constructor();
}
export declare type Attribute = AttributeArray | AttributeObject;
export declare type AttributeArray = number[] | [number, number][] | [number, number, number][] | [number, number, number, number][];
export declare type AttributeObject = AttributePointer | AttributeIPointer;
export interface AttributePointer {
	type: "pointer";
	value: VertexBuffer | PointerValue;
	count: number;
	size: number;
	normalized?: boolean;
	divisor?: number;
}
export interface AttributeIPointer {
	type: "ipointer";
	value: VertexBuffer<IPointerValue["type"]> | IPointerValue;
	count: number;
	size: number;
	divisor?: number;
}
export declare type PointerValue = VertexBufferProps;
export declare type IPointerValue = VertexBufferInt8Props | VertexBufferInt16Props | VertexBufferInt32Props | VertexBufferUint8Props | VertexBufferUint16Props | VertexBufferUint32Props;
export interface VertexArrayProps {
	attributes: {
		[name: string]: Attribute;
		[location: number]: Attribute;
	};
	elements?: ElementBuffer | ElementBufferProps;
}
export declare class VertexArray {
	readonly glVertexArrayObject: WebGLVertexArrayObject;
	readonly hasElements: boolean;
	readonly count: number;
	readonly instanceCount: number;
	static create(dev: WebGL2RenderingContext | Device, {attributes, elements}: VertexArrayProps): VertexArray;
	private constructor();
}
export interface TextureOptions {
	min?: MinFilter;
	mag?: MagFilter;
	wrapS?: TextureWrap;
	wrapT?: TextureWrap;
	mipmap?: boolean;
}
export declare const enum TextureWrap {
	CLAMP_TO_EDGE = "clamp-to-edge",
	REPEAT = "repeat",
	MIRRORED_REPEAT = "mirrored-repeat",
}
export declare const enum TextureFilter {
	NEAREST = "nearest",
	LINEAR = "linear",
	NEAREST_MIPMAP_NEAREST = "nearest-mipmap-nearest",
	LINEAR_MIPMAP_NEAREST = "linear-mipmap-nearest",
	NEAREST_MIPMAP_LINEAR = "nearest-mipmap-linear",
	LINEAR_MIPMAP_LINEAR = "linear-mipmap-linear",
}
export declare type MinFilter = TextureFilter;
export declare type MagFilter = TextureFilter.NEAREST | TextureFilter.LINEAR;
export declare const enum TextureInternalFormat {
	R8 = "R8",
	R8_SNORM = "R8_SNORM",
	R8UI = "R8UI",
	R8I = "R8I",
	R16UI = "R16UI",
	R16I = "R16I",
	R32UI = "R32UI",
	R32I = "R32I",
	R16F = "R16F",
	R32F = "R32F",
	RG8 = "RG8",
	RG8_SNORM = "RG8_SNORM",
	RG8UI = "RG8UI",
	RG8I = "RG8I",
	RG16UI = "RG16UI",
	RG16I = "RG16I",
	RG32UI = "RG32UI",
	RG32I = "RG32I",
	RG16F = "RG16F",
	RG32F = "RG32F",
	RGB8 = "RGB8",
	RGB8_SNORM = "RGB8_SNORM",
	RGB8UI = "RGB8UI",
	RGB8I = "RGB8I",
	RGB16UI = "RGB16UI",
	RGB16I = "RGB16I",
	RGB32UI = "RGB32UI",
	RGB32I = "RGB32I",
	RGB16F = "RGB16F",
	RGB32F = "RGB32F",
	RGBA8 = "RGBA8",
	RGBA8_SNORM = "RGBA8_SNORM",
	RGBA8UI = "RGBA8UI",
	RGBA8I = "RGBA8I",
	RGBA16UI = "RGBA16UI",
	RGBA16I = "RGBA16I",
	RGBA32UI = "RGBA32UI",
	RGBA32I = "RGBA32I",
	RGBA16F = "RGBA16F",
	RGBA32F = "RGBA32F",
}
export declare const enum TextureFormat {
	RED = "RED",
	RG = "RG",
	RGB = "RGB",
	RGBA = "RGBA",
	RED_INTEGER = "RED_INTEGER",
	RG_INTEGER = "RG_INTEGER",
	RGB_INTEGER = "RGB_INTEGER",
	RGBA_INTEGER = "RGBA_INTEGER",
}
export declare const enum TextureType {
	UNSIGNED_BYTE = "UNSIGNED_BYTE",
	UNSIGNED_SHORT = "UNSIGNED_SHORT",
	UNSIGNED_INT = "UNSIGNED_INT",
	BYTE = "BYTE",
	SHORT = "SHORT",
	INT = "INT",
	FLOAT = "FLOAT",
}
export declare class Texture {
	readonly glTexture: WebGLTexture;
	readonly width: number;
	readonly height: number;
	static fromImage(dev: WebGL2RenderingContext | Device, image: ImageData, options?: TextureOptions): Texture;
	static fromRGBA8(dev: WebGL2RenderingContext | Device, data: number[] | Uint8Array | Uint8ClampedArray | null, width: number, height: number, options?: TextureOptions): Texture;
	static fromRG16F(dev: WebGL2RenderingContext | Device, data: number[] | Float32Array | null, width: number, height: number, options?: TextureOptions): Texture;
	static fromRGB16F(dev: WebGL2RenderingContext | Device, data: number[] | Float32Array | null, width: number, height: number, options?: TextureOptions): Texture;
	static fromRGBA16F(dev: WebGL2RenderingContext | Device, data: number[] | Float32Array | null, width: number, height: number, options?: TextureOptions): Texture;
	static fromRGB32F(dev: WebGL2RenderingContext | Device, data: number[] | Float32Array | null, width: number, height: number, options?: TextureOptions): Texture;
	static fromRGBA32F(dev: WebGL2RenderingContext | Device, data: number[] | Float32Array | null, width: number, height: number, options?: TextureOptions): Texture;
	static fromArrayBufferView(dev: WebGL2RenderingContext | Device, data: ArrayBufferView | null, width: number, height: number, internalFormat: TextureInternalFormat, format: TextureFormat, type: TextureType, {min, mag, wrapS, wrapT, mipmap}?: TextureOptions): Texture;
	private constructor();
}
export declare class Framebuffer {
	readonly glFramebuffer: WebGLFramebuffer;
	readonly glColorAttachments: number[];
	readonly width: number;
	readonly height: number;
	static create(dev: WebGL2RenderingContext | Device, textures: Texture[]): Framebuffer;
	private constructor();
}
export declare type Color = [number, number, number, number];
export interface CommandProps<P> {
	vert: string;
	frag: string;
	uniforms?: {
		[key: string]: Uniform<P>;
	};
	primitive?: Primitive;
	blend?: {
		src: BlendFunction;
		dst: BlendFunction;
		equation?: BlendEquation;
		color?: Color;
	} | boolean;
	clear?: {
		color?: Color;
		depth?: number;
		stencil?: number;
	};
}
export declare type AccessorOrValue<P, R> = Accessor<P, R> | R;
export declare type Accessor<P, R> = (props: P) => R;
export declare type Uniform<P> = Uniform1f<P> | Uniform1fv<P> | Uniform1i<P> | Uniform1iv<P> | Uniform1ui<P> | Uniform1uiv<P> | Uniform2f<P> | Uniform2fv<P> | Uniform2i<P> | Uniform2iv<P> | Uniform2ui<P> | Uniform2uiv<P> | Uniform3f<P> | Uniform3fv<P> | Uniform3i<P> | Uniform3iv<P> | Uniform3ui<P> | Uniform3uiv<P> | Uniform4f<P> | Uniform4fv<P> | Uniform4i<P> | Uniform4iv<P> | Uniform4ui<P> | Uniform4uiv<P> | UniformMatrix2fv<P> | UniformMatrix3fv<P> | UniformMatrix4fv<P> | UniformTexture<P>;
export interface Uniform1f<P> {
	type: "1f";
	value: AccessorOrValue<P, number>;
}
export interface Uniform1fv<P> {
	type: "1fv";
	value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform1i<P> {
	type: "1i";
	value: AccessorOrValue<P, number>;
}
export interface Uniform1iv<P> {
	type: "1iv";
	value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform1ui<P> {
	type: "1ui";
	value: AccessorOrValue<P, number>;
}
export interface Uniform1uiv<P> {
	type: "1uiv";
	value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform2f<P> {
	type: "2f";
	value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform2fv<P> {
	type: "2fv";
	value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform2i<P> {
	type: "2i";
	value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform2iv<P> {
	type: "2iv";
	value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform2ui<P> {
	type: "2ui";
	value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform2uiv<P> {
	type: "2uiv";
	value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform3f<P> {
	type: "3f";
	value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform3fv<P> {
	type: "3fv";
	value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform3i<P> {
	type: "3i";
	value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform3iv<P> {
	type: "3iv";
	value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform3ui<P> {
	type: "3ui";
	value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform3uiv<P> {
	type: "3uiv";
	value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform4f<P> {
	type: "4f";
	value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform4fv<P> {
	type: "4fv";
	value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface Uniform4i<P> {
	type: "4i";
	value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform4iv<P> {
	type: "4iv";
	value: AccessorOrValue<P, Int32Array | number[]>;
}
export interface Uniform4ui<P> {
	type: "4ui";
	value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface Uniform4uiv<P> {
	type: "4uiv";
	value: AccessorOrValue<P, Uint32Array | number[]>;
}
export interface UniformMatrix2fv<P> {
	type: "matrix2fv";
	value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface UniformMatrix3fv<P> {
	type: "matrix3fv";
	value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface UniformMatrix4fv<P> {
	type: "matrix4fv";
	value: AccessorOrValue<P, Float32Array | number[]>;
}
export interface UniformTexture<P> {
	type: "texture";
	value: AccessorOrValue<P, Texture>;
}
export declare const enum Primitive {
	TRIANGLES = "triangles",
	TRIANGLE_STRIP = "triangle-strip",
	TRIANGLE_FAN = "triangle-fan",
	POINTS = "points",
	LINES = "lines",
	LINE_STRIP = "line-strip",
	LINE_LOOP = "line-loop",
}
export declare const enum BlendFunction {
	ZERO = "zero",
	ONE = "one",
	SRC_COLOR = "src-color",
	SRC_ALPHA = "src-alpha",
	ONE_MINUS_SRC_COLOR = "one-minus-src-color",
	ONE_MINUS_SRC_ALPHA = "one-minus-src-alpha",
	DST_COLOR = "dst-color",
	DST_ALPHA = "dst-alpha",
	ONE_MINUS_DST_COLOR = "one-minus-dst-color",
	ONE_MINUS_DST_ALPHA = "one-minus-dst-alpha",
	CONSTANT_COLOR = "constant-color",
	CONSTANT_ALPHA = "constant-alpha",
	ONE_MINUS_CONSTANT_COLOR = "one-minus-constant-color",
	ONE_MINUS_CONSTANT_ALPHA = "one-minus-constant-alpha",
}
export declare const enum BlendEquation {
	ADD = "add",
	SUBTRACT = "subtract",
	REVERSE_SUBTRACT = "reverse-subtract",
	MIN = "min",
	MAX = "max",
}
export declare class Command<P = void> {
	private gl;
	private glProgram;
	private glPrimitive;
	private uniformDescriptors;
	private blendDescriptor;
	private clearDescriptor;
	static create<P = void>(dev: WebGL2RenderingContext | Device, {vert, frag, uniforms, primitive, blend, clear}: CommandProps<P>): Command<P>;
	private constructor();
	execute(vao: VertexArray, props: P, framebuffer?: Framebuffer): void;
	locate({attributes, elements}: VertexArrayProps): VertexArrayProps;
	private beginBlend();
	private endBlend();
	private clear();
	private drawArrays(count, instCount);
	private drawElements(count, instCount);
	private updateUniforms(props);
}

export as namespace glutenfree;
