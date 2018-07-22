import * as assert from "./assert";

export type ChangeDiffCallback<T> = (
    prevValue: T,
    newValue: T,
    op: "push" | "pop",
) => boolean;

export type ChangeApplyCallback<T> = (
    value: T,
    op: "init" | "push" | "pop",
) => void;

export class Stack<T> {

    private s: T[];
    private onChangeDiff: ChangeDiffCallback<T>;
    private onChangeApply: ChangeApplyCallback<T>;

    constructor(
        initialValue: T,
        onChangeDiff: ChangeDiffCallback<T>,
        onChangeApply: ChangeApplyCallback<T>,
    ) {
        this.s = [initialValue];
        this.onChangeDiff = onChangeDiff;
        this.onChangeApply = onChangeApply;
        onChangeApply(initialValue, "init");
    }

    get length(): number {
        return this.s.length;
    }

    push(value: T): void {
        const top = this.peek();
        if (this.onChangeDiff(top, value, "push")) {
            this.onChangeApply(value, "push");
        }
        this.s.push(value);
    }

    pop(): T {
        assert.gte(
            this.s.length,
            2,
            () => "Stack must contain at least two element for pop",
        );
        const prevValue = this.s.pop()!;
        const top = this.peek();
        if (this.onChangeDiff(prevValue, top, "pop")) {
            this.onChangeApply(top, "pop");
        }
        return prevValue;
    }

    peek(): T {
        assert.nonEmpty(this.s, () => "Stack must never be empty for peek");
        return this.s[this.s.length - 1];
    }
}
