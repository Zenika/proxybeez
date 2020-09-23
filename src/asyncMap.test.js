import * as assert from "assert";
import asyncMap from "./asyncMap.js";

(async () => {
  const actual = await asyncMap([], () => {});
  const expected = [];
  assert.deepStrictEqual(
    actual,
    expected,
    "'asyncMap' does not return an empty array when given an empty array"
  );
})();

(async () => {
  const actual = await asyncMap(Array.from({ length: 3 }), () => {});
  const expected = 3;
  assert.strictEqual(
    actual.length,
    expected,
    "'asyncMap' does not return an array with the same length as its input array"
  );
})();

(async () => {
  const actual = await asyncMap([1], (i) => i + 1);
  const expected = [2];
  assert.deepStrictEqual(
    actual,
    expected,
    "'asyncMap' does not apply the mapper function on one element"
  );
})();

(async () => {
  const actual = await asyncMap([1, 2], (i) => i + 1);
  const expected = [2, 3];
  assert.deepStrictEqual(
    actual,
    expected,
    "'asyncMap' does not apply the mapper function on all elements"
  );
})();
