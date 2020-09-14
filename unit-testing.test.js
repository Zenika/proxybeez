import { parseAlibeezParamsFromQuery } from "./src/utils.js";

const isQueryEscapedCorrectly = () => {
  const query = "username=dreamlab@zenika.com";
  const result = parseAlibeezParamsFromQuery(query);
  console.assert(
    result.username === "dreamlab%40zenika.com",
    "Error for test isQueryEscapedCorrectly"
  );

  const query2 = "username=dreamlab@zenika.com&filter=lastName==dreamlab";
  const result2 = parseAlibeezParamsFromQuery(query);
  console.assert(result2.username === "dreamlab%40zenika.com");
};

isQueryEscapedCorrectly();
