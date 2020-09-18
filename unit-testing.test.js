import { parseAlibeezParamsFromQuery, computeUrlWithKey } from "./src/utils.js";

const isQueryEscapedCorrectly = () => {
  const baseUrl = "https://test.test/api";
  const configUrl =
    "/query/users?filter=username==${username}&fields=uuid,firstName,lastName";
  const alibeezParams = {
    username: "dreamleab@zenika.com",
  };
  const ignore = [];
  const key = "key";

  const computedUrlWithKey = computeUrlWithKey(
    baseUrl,
    configUrl,
    alibeezParams,
    ignore,
    key
  );
  console.assert(
    computedUrlWithKey.href ===
      "https://test.test/api/query/users?filter=username%3D%3Ddreamleab%40zenika.com&fields=uuid%2CfirstName%2ClastName&key=key",
    "Error for test isQueryEscapedCorrectly"
  );

  alibeezParams.username = "dreamleab@zenika.com&filter=lastName==dreamlab";
  const computedUrlWithKey2 = computeUrlWithKey(
    baseUrl,
    configUrl,
    alibeezParams,
    ignore,
    key
  );
  console.assert(
    computedUrlWithKey2.href ===
      "https://test.test/api/query/users?filter=username%3D%3Ddreamleab%40zenika.com%26filter%3DlastName%3D%3Ddreamlab&fields=uuid%2CfirstName%2ClastName&key=key",
    "Error for test isQueryEscapedCorrectly"
  );
};

isQueryEscapedCorrectly();
