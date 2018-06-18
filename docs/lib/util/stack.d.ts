export declare type Op = "init" | "push" | "pop";
export declare type ChangeDiffCallback<T> = (prevValue: T, newValue: T, op: Op) => void;
export declare type ChangeApplyCallback<T> = (value: T, op: Op) => void;
export declare class Stack<T> {
    private s;
    private onChangeDiff;
    private onChangeApply;
    constructor(initialValue: T, onChangeDiff: ChangeDiffCallback<T>, onChangeApply: ChangeApplyCallback<T>);
    push(value: T): void;
    pop(): T;
    peek(): T;
}
//# sourceMappingURL=stack.d.ts.map