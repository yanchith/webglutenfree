import test from "ava";

import { Stack, ChangeDiffCallback } from "./stack";

const TRUE = () => true;
const FALSE = () => false;
const NO_OP = () => void 0;

test("Stack is created with one initial element", (t) => {
    const stack = new Stack<number>(0, TRUE, NO_OP);
    t.is(stack.length, 1);
});

test("Stack grows with added elements", (t) => {
    const stack = new Stack<number>(0, TRUE, NO_OP);
    t.is(stack.length, 1);

    for (let i = 1; i <= 5; ++i) {
        stack.push(i);
        t.is(stack.length, i + 1);
    }
});

test("Stack pops correct elements and shrinks", (t) => {
    const stack = new Stack<number>(0, TRUE, NO_OP);
    stack.push(1);
    stack.push(2);
    stack.push(3);

    t.is(stack.length, 4);

    t.is(stack.pop(), 3);
    t.is(stack.length, 3);

    t.is(stack.pop(), 2);
    t.is(stack.length, 2);

    t.is(stack.pop(), 1);
    t.is(stack.length, 1);
});

test("Stack peeks correct element", (t) => {
    const stack = new Stack<number>(0, TRUE, NO_OP);
    t.is(stack.peek(), 0);

    stack.push(1);
    t.is(stack.peek(), 1);

    stack.push(2);
    t.is(stack.peek(), 2);

    t.is(stack.pop(), 2);
    t.is(stack.peek(), 1);

    t.is(stack.pop(), 1);
    t.is(stack.peek(), 0);
});

test("Stack throws on last element removal attempt", (t) => {
    const stack = new Stack<number>(0, TRUE, NO_OP);
    t.throws(() => stack.pop());
});

test("Stack calls diff callback on each push/pop", (t) => {
    let callCount = 0;

    const stack = new Stack<number>(0, () => {
        callCount++;
        return true;
    }, NO_OP);
    t.is(callCount, 0);

    stack.push(1);
    t.is(callCount, 1);

    stack.pop();
    t.is(callCount, 2);
});

test("Stack doesn't call diff callback on peek", (t) => {
    let callCount = 0;

    const stack = new Stack<number>(0, () => {
        callCount++;
        return true;
    }, NO_OP);
    t.is(callCount, 0);

    stack.peek();
    t.is(callCount, 0);
});

test("Stack provides correct arguments to diff callback on push/pop", (t) => {
    t.plan(3 + 3);

    const expected = {
        prevValue: 0,
        newValue: 1,
        op: "push",
    };

    const fnDiff: ChangeDiffCallback<number> = (prevValue, newValue, op) => {
        t.is(prevValue, expected.prevValue);
        t.is(newValue, expected.newValue);
        t.is(op, expected.op);
        return true;
    };

    const stack = new Stack<number>(0, fnDiff, NO_OP);
    stack.push(1);

    expected.prevValue = 1;
    expected.newValue = 0;
    expected.op = "pop";

    stack.pop();
});

test("Stack always calls apply callback for init", (t) => {
    let callCountTrue = 0;
    const _t = new Stack<number>(0, TRUE, () => callCountTrue++);
    t.is(callCountTrue, 1);
    _t.peek();

    let callCountFalse = 0;
    const _f = new Stack<number>(0, FALSE, () => callCountFalse++);
    t.is(callCountFalse, 1);
    _f.peek();
});

test("Stack calls apply callback if diff callback returns true", (t) => {
    const callCounts = {
        init: 0,
        push: 0,
        pop: 0,
    };

    const stack = new Stack<number>(0, TRUE, (_, op) => callCounts[op]++);
    stack.push(1);
    stack.push(2);
    stack.peek();
    stack.pop();
    stack.pop();

    t.is(callCounts.init, 1);
    t.is(callCounts.push, 2);
    t.is(callCounts.pop, 2);
});

test("Stack only calls apply callback for init if diff callback returns false", (t) => {
    const callCounts = {
        init: 0,
        push: 0,
        pop: 0,
    };

    const stack = new Stack<number>(0, FALSE, (_, op) => callCounts[op]++);
    stack.push(1);
    stack.push(2);
    stack.peek();
    stack.pop();
    stack.pop();

    t.is(callCounts.init, 1);
    t.is(callCounts.push, 0);
    t.is(callCounts.pop, 0);
});
