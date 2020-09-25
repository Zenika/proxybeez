import * as assert from "assert";
import deepDefaults from "./deepDefaults.js";

{
  const actual = deepDefaults(null);
  const expected = {};
  assert.deepStrictEqual(
    actual,
    expected,
    "'deepDefaults' does not return empty object when input is null"
  );
}

{
  const actual = deepDefaults({ a: 1 }, null);
  const expected = { a: 1 };
  assert.deepStrictEqual(
    actual,
    expected,
    "'deepDefaults' does not return source values if defaults is null"
  );
}

{
  const actual = deepDefaults({}, { a: 1 });
  const expected = { a: 1 };
  assert.deepStrictEqual(
    actual,
    expected,
    "'deepDefaults' does not apply defaults"
  );
}

{
  const actual = deepDefaults({ a: 2 }, { a: 1 });
  const expected = { a: 2 };
  assert.deepStrictEqual(
    actual,
    expected,
    "'deepDefaults' overrides source values"
  );
}

{
  const actual = deepDefaults({ b: 2 }, { a: 1 });
  const expected = { a: 1, b: 2 };
  assert.deepStrictEqual(
    actual,
    expected,
    "'deepDefaults' does not return both source values and default vaules"
  );
}

{
  const actual = deepDefaults({ a: { b: 1 } }, { a: { c: 2 } });
  const expected = { a: { b: 1, c: 2 } };
  assert.deepStrictEqual(
    actual,
    expected,
    "'deepDefaults' does not apply default values deeply"
  );
}
