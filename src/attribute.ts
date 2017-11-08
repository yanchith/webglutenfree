import * as assert from "./assert";
import * as array from "./array";
import VertexBuffer, {
    VertexBufferProps,
    VertexBufferInt8Props,
    VertexBufferInt16Props,
    VertexBufferInt32Props,
    VertexBufferUint8Props,
    VertexBufferUint16Props,
    VertexBufferUint32Props,
} from "./vertex-buffer";

export type AttributeType =
    | "pointer"
    | "ipointer"
    ;

export type AttributeProps =
    | AttributeArrayProps
    | AttributeObjectProps
    ;

export type AttributeArrayProps =
    | number[]
    | [number, number][]
    | [number, number, number][]
    | [number, number, number, number][]
    ;

export type AttributeObjectProps =
    | AttributePointerProps
    | AttributeIPointerProps
    ;

export interface AttributePointerProps {
    type: "pointer";
    value: VertexBuffer | PointerValueProps;
    count: number;
    size: number;
    normalized?: boolean;
    divisor?: number;
}

export interface AttributeIPointerProps {
    type: "ipointer";
    value: VertexBuffer<IPointerValueType> | IPointerValueProps;
    count: number;
    size: number;
    divisor?: number;
}

export type PointerValueProps = VertexBufferProps;

export type IPointerValueProps =
    | VertexBufferInt8Props
    | VertexBufferInt16Props
    | VertexBufferInt32Props
    | VertexBufferUint8Props
    | VertexBufferUint16Props
    | VertexBufferUint32Props
    ;

export type IPointerValueType = IPointerValueProps["type"];

export default class Attribute {

    static fromProps(
        gl: WebGL2RenderingContext,
        props: AttributeProps,
    ): Attribute {
        if (Array.isArray(props)) {
            return Attribute.fromArray(gl, props);
        }

        switch (props.type) {
            case "pointer": return Attribute.fromPointer(
                gl,
                props.value,
                props.count,
                props.size,
                props.normalized,
                props.divisor,
            );
            case "ipointer": return Attribute.fromIPointer(
                gl,
                props.value,
                props.count,
                props.size,
                props.divisor,
            );
            default: return assert.never(props);
        }

    }

    static fromArray(
        gl: WebGL2RenderingContext,
        arr: AttributeArrayProps,
    ): Attribute {
        if (array.is2DArray(arr)) {
            const r = array.ravel(arr);
            return Attribute.fromPointer(
                gl,
                VertexBuffer.fromFloat32Array(gl, r.data),
                r.shape[0],
                r.shape[1],
            );
        }
        return Attribute.fromPointer(
            gl,
            VertexBuffer.fromFloat32Array(gl, arr),
            arr.length,
            1,
        );
    }

    static fromPointer(
        gl: WebGL2RenderingContext,
        buffer: VertexBuffer | PointerValueProps,
        count: number,
        size: number,
        normalized: boolean = false,
        divisor: number = 0,
    ): Attribute {
        return new Attribute(
            "pointer",
            buffer instanceof VertexBuffer
                ? buffer
                // Note: typescript is not smart enough to infer what we know
                : VertexBuffer.fromProps(gl, buffer as any),
                count,
                size,
                normalized,
                divisor,
            );
        }

        static fromIPointer(
            gl: WebGL2RenderingContext,
            buffer: VertexBuffer<IPointerValueType> | IPointerValueProps,
            count: number,
            size: number,
            divisor: number = 0,
        ): Attribute {
            return new Attribute(
                "ipointer",
                buffer instanceof VertexBuffer
                ? buffer
                // Note: typescript is not smart enough to infer what we know
                : VertexBuffer.fromProps(gl, buffer as any),
            count,
            size,
            false,
            divisor,
        );
    }

    readonly type: AttributeType;
    readonly buffer: VertexBuffer;
    readonly count: number;
    readonly size: number;
    readonly normalized: boolean;
    readonly divisor: number;

    private constructor(
        type: AttributeType,
        buffer: VertexBuffer,
        count: number,
        size: number,
        normalized: boolean,
        divisor: number,
    ) {
        this.type = type;
        this.buffer = buffer;
        this.count = count;
        this.size = size;
        this.normalized = normalized;
        this.divisor = divisor;
    }
}
