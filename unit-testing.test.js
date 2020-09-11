import { parseAlibeezParamsFromQuery } from "./src/utils.js";

const isQueryEscapedCorrectly = () => {
  const query = "username=dreamlab@zenika.com"
  const result = parseAlibeezParamsFromQuery(query)
  console.assert(result.username === "dreamlab%40zenika.com", "Error for test isQueryEscapedCorrectly")
}

isQueryEscapedCorrectly()
