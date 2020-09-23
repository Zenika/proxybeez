import * as assert from "assert";
import renderTemplate from "./renderTemplate.js";

{
  const actual = renderTemplate("${var}", { var: "varValue" });
  const expected = "varValue";
  assert.strictEqual(
    actual,
    expected,
    "'renderTemplate' cannot interpolate a single variable in a string with nothing else in it"
  );
}

{
  const actual = renderTemplate("this is the value: ${var};", {
    var: "varValue",
  });
  const expected = "this is the value: varValue;";
  assert.strictEqual(
    actual,
    expected,
    "'renderTemplate' cannot interpolate a single variable in a string with static content around it"
  );
}

{
  const actual = renderTemplate(
    "this is the value: ${var}; this is another value ${val};",
    { var: "varValue", val: "valValue" }
  );
  const expected =
    "this is the value: varValue; this is another value valValue;";
  assert.strictEqual(
    actual,
    expected,
    "'renderTemplate' cannot interpolate multiple variables in a string with static content around them"
  );
}
