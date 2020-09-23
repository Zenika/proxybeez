import * as assert from "assert";
import { renderOutgoingUrl } from "./server.js";
import {} from "./requestProcessors/excludeFields.test.js";
import {} from "./requestProcessors/insertKey.test.js";
import {} from "./responseProcessors/defaultFields.test.js";
import {} from "./renderTemplate.test.js";

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
