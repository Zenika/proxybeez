import * as assert from "assert";
import renderPathTemplate from "./renderPathTemplate.js";

{
  const actual = renderPathTemplate(
    "${var}",
    new URLSearchParams({ var: "varValue" })
  );
  const expected = "varValue";
  assert.strictEqual(
    actual,
    expected,
    "'renderPathTemplate' cannot handle a single variable in a string with nothing else in it"
  );
}

{
  const actual = renderPathTemplate(
    "this is the value: ${var};",
    new URLSearchParams({
      var: "varValue",
    })
  );
  const expected = "this is the value: varValue;";
  assert.strictEqual(
    actual,
    expected,
    "'renderPathTemplate' cannot handle a single variable in a string with static content around it"
  );
}

{
  const actual = renderPathTemplate(
    "this is the value: ${var}; this is another value ${val};",
    new URLSearchParams({ var: "varValue", val: "valValue" })
  );
  const expected =
    "this is the value: varValue; this is another value valValue;";
  assert.strictEqual(
    actual,
    expected,
    "'renderPathTemplate' cannot handle multiple variables in a string with static content around them"
  );
}

{
  assert.throws(
    () => renderPathTemplate("${var}", new URLSearchParams()),
    { key: "var" },
    "'renderPathTemplate' does not throw on missing key"
  );
}

{
  const actual = renderPathTemplate(
    "/path?param=${param}",
    new URLSearchParams({ param: "value&evil_injection=666" })
  );
  const expected = "/path?param=value%26evil_injection%3D666";
  assert.strictEqual(
    actual,
    expected,
    "'renderPathTemplate' might be vulnerable to injection attacks"
  );
}
