import * as assert from "assert";
import interpolate from "./interpolate.js";

{
  const actual = interpolate("${var}", { var: "varValue" });
  const expected = "varValue";
  assert.strictEqual(
    actual,
    expected,
    "'interpolate' cannot handle a single variable in a string with nothing else in it"
  );
}

{
  const actual = interpolate("this is the value: ${var};", {
    var: "varValue",
  });
  const expected = "this is the value: varValue;";
  assert.strictEqual(
    actual,
    expected,
    "'interpolate' cannot handle a single variable in a string with static content around it"
  );
}

{
  const actual = interpolate(
    "this is the value: ${var}; this is another value ${val};",
    { var: "varValue", val: "valValue" }
  );
  const expected =
    "this is the value: varValue; this is another value valValue;";
  assert.strictEqual(
    actual,
    expected,
    "'interpolate' cannot handle multiple variables in a string with static content around them"
  );
}
