import * as assert from "./assert";

export type Callback<T> = (value: T) => void;

export class Stack<T> {

    private s: T[];
    private cb: Callback<T>;

    constructor(initialValue: T, cb: Callback<T>) {
        this.s = [initialValue];
        this.cb = cb;
    }

    push(value: T): void {
        this.s.push(value);
        this.cb(value);
    }

    pop(): T {
        assert.nonEmpty(this.s, "Stack must not be empty for pop");
        const value = this.s.pop();
        this.cb(this.peek());
        return value!;
    }

    peek(): T {
        assert.nonEmpty(this.s, "Stack must never be empty for peek");
        return this.s[this.s.length - 1];
    }
}
