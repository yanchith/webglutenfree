export declare type ChangeDiffCallback<T> = (prevValue: T, newValue: T, op: "push" | "pop") => boolean;
export declare type ChangeApplyCallback<T> = (value: T, op: "init" | "push" | "pop") => void;
export declare class Stack<T> {
    private s;
    private onChangeDiff;
    private onChangeApply;
    constructor(initialValue: T, onChangeDiff: ChangeDiffCallback<T>, onChangeApply: ChangeApplyCallback<T>);
    readonly length: number;
    push(value: T): void;
    pop(): T;
    peek(): T;
}
//# sourceMappingURL=stack.d.ts.map