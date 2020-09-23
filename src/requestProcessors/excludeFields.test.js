import * as assert from "assert";
import { excludeFields } from "./excludeFields.js";

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
