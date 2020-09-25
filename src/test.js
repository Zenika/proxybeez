import * as assert from "assert";
import { renderOutgoingPath } from "./server.js";
import {} from "./requestProcessors/excludeFields.test.js";
import {} from "./requestProcessors/insertKey.test.js";
import {} from "./responseProcessors/defaultFields.test.js";
import {} from "./utils/interpolate.test.js";
import {} from "./utils/asyncMap.test.js";
import {} from "./utils/deepDefaults.test.js";

{
  const actual = renderOutgoingPath(
    "/path?param=${param}",
    new URLSearchParams({ param: "value&evil_injection=666" })
  );
  const expected = "/path?param=value%26evil_injection%3D666";
  assert.strictEqual(
    actual,
    expected,
    "'renderOutgoingUrl' might be vulnerable to injection attacks"
  );
}
