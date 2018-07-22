import test from "ava";

import { is2, shape2 } from "./array";

test("is2 returns false for empty arrays", (t) => {
    t.false(is2([]));
});

test("is2 returns false for degenerate (empty 2d) arrays", (t) => {
    t.false(is2([[]]));
    t.false(is2([[], [], []]));
});

test("is2 returns true for nonjagged 2d arrays", (t) => {
    t.true(is2([[1], [2], [3]]));
    t.true(is2([[1, 2], [2, 3], [3, 4]]));
    t.true(is2([[1, 2, 3], [2, 3, 4], [3, 4, 5]]));
});

test("is2 throws for jagged 2d arrays", (t) => {
    t.throws(() => is2([[1], []]));
    t.throws(() => is2([[], [1]]));
    t.throws(() => is2([[1, 2], []]));
    t.throws(() => is2([[], [1, 2]]));
    t.throws(() => is2([[1, 2], [1]]));
    t.throws(() => is2([[1], [1, 2]]));
    t.throws(() => is2([0, [1]]));
    t.throws(() => is2([[1], 0]));
});

test("is2 returns false for 1d arrays", (t) => {
    t.false(is2([]));
    t.false(is2([1, 2, 3]));
});

test("shape2 returns shape of nondegenerate 2d array", (t) => {
    t.deepEqual([3, 1], shape2([[1], [2], [3]]));
    t.deepEqual([3, 3], shape2([[1, 2, 3], [2, 3, 4], [3, 4, 5]]));
    t.deepEqual([1, 3], shape2([[1, 2, 3]]));
});
