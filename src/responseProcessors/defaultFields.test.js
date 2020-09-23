import * as assert from "assert";
import { defaultFields } from "./defaultFields.js";

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
