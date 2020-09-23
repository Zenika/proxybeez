import * as assert from "assert";
import { renderOutgoingUrl } from "./server.js";
import { insertKey } from "./request-processors.js";
import { defaultFields } from "./response-processors.js";

(() => {
  const actual = renderOutgoingUrl(
    "http://example.com",
    "/path?param=${param}",
    new URLSearchParams({ param: "value&evil_injection=666" })
  );
  const expected = "http://example.com/path?param=value%26evil_injection%3D666";
  assert.strictEqual(
    actual,
    expected,
    "renderOutgoingUrl might be vulnerable to injection attacks"
  );
})();

(() => {
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
})();

(() => {
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
})();

(() => {
  const keyValue = "the_key";
  const actual = insertKey("http://example.com", keyValue);
  assert.ok(actual.searchParams.has("key"));
  assert.strictEqual(
    actual.searchParams.get("key"),
    keyValue,
    "'insertKey' does not insert a 'key' search param"
  );
})();

(() => {
  const keyValue = "the_key";
  const actual = insertKey("http://example.com", keyValue);
  assert.strictEqual(
    actual.searchParams.get("key"),
    keyValue,
    "'insertKey' does not insert the correct key value"
  );
})();
