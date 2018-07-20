import test from "ava";

import { Stack } from "./stack";

const TRUE = () => true;
const NO_OP = () => void 0;

test("Stack is created with one initial element", (t) => {
    const stack = new Stack<number>(0, TRUE, NO_OP);
    t.is(stack.length, 1);
});
