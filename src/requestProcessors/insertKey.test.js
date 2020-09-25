import * as assert from "assert";
import { insertKey } from "./insertKey.js";

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
