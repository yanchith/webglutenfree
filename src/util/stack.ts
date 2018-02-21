import * as assert from "./assert";

export type Op = "push" | "pop";
export type ChangeCallback<T> = (prevValue: T, newValue: T, op: Op) => void;

export class Stack<T> {

    private s: T[];
    private onChange: ChangeCallback<T>;

    constructor(initialValue: T, onChange: ChangeCallback<T>) {
        this.s = [initialValue];
        this.onChange = onChange;
    }

    push(value: T): void {
        this.onChange(this.peek(), value, "push");
        this.s.push(value);
    }

    pop(): T {
        assert.nonEmpty(this.s, "Stack must not be empty for pop");
        const prevValue = this.s.pop()!;
        this.onChange(prevValue, this.peek(), "pop");
        return prevValue;
    }

    peek(): T {
        assert.nonEmpty(this.s, "Stack must never be empty for peek");
        return this.s[this.s.length - 1];
    }
}
