import * as assert from "assert";
import { renderOutgoingUrl, renderTemplate } from "./server.js";
import { excludeFields, insertKey } from "./request-processors.js";
import { defaultFields } from "./response-processors.js";

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

{
  const actual = renderOutgoingUrl(
    "http://example.com",
    "/path?param=${param}",
    new URLSearchParams({ param: "value&evil_injection=666" })
  );
  const expected = "http://example.com/path?param=value%26evil_injection%3D666";
  assert.strictEqual(
    actual,
    expected,
    "'renderOutgoingUrl' might be vulnerable to injection attacks"
  );
}

{
  const actual = defaultFields(
    { result: [{}] },
    { "tag.etablissement": "Singapore" }
  );
  const expected = { result: [{ "tag.etablissement": "Singapore" }] };
  assert.deepStrictEqual(
    actual,
    expected,
    "'defaultFields' does not fill fields with defaults"
  );
}

{
  const actual = defaultFields(
    { result: [{ "tag.etablissement": "Nantes" }] },
    { "tag.etablissement": "Singapore" }
  );
  const expected = { result: [{ "tag.etablissement": "Nantes" }] };
  assert.deepStrictEqual(
    actual,
    expected,
    "'defaultFields' overrides fields that already have a value"
  );
}

{
  const actual = excludeFields("http://example.com?fields=excluded", [
    "excluded",
  ]);
  assert.doesNotMatch(
    actual.searchParams.get("fields"),
    /excluded/,
    "'excludeFields' cannot exclude the only field"
  );
}

{
  const actual = excludeFields(
    "http://example.com?fields=included,excluded,alsoIncluded",
    ["excluded"]
  );
  assert.doesNotMatch(
    actual.searchParams.get("fields"),
    /excluded/,
    "'excludeFields' cannot exclude one field among multiple"
  );
}

{
  const actual = excludeFields(
    "http://example.com?fields=included,alsoIncluded",
    ["excluded"]
  );
  assert.match(
    actual.searchParams.get("fields"),
    /included,alsoIncluded/,
    "'excludeFields' excludes fields that it should not"
  );
}

{
  const keyValue = "the_key";
  const actual = insertKey("http://example.com", keyValue);
  assert.ok(actual.searchParams.has("key"));
  assert.strictEqual(
    actual.searchParams.get("key"),
    keyValue,
    "'insertKey' does not insert a 'key' search param"
  );
}

{
  const keyValue = "the_key";
  const actual = insertKey("http://example.com", keyValue);
  assert.strictEqual(
    actual.searchParams.get("key"),
    keyValue,
    "'insertKey' does not insert the correct key value"
  );
}
