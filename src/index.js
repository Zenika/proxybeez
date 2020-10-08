import * as fs from "fs";
import { typecheckConfig } from "./config.js";
import { createServer } from "./server.js";

const PORT = process.env.PORT || 3000;
const CONFIG = readConfig(
  process.env.PROXYBEEZ_CONFIG,
  process.env.PROXYBEEZ_CONFIG_FILE
);

createServer(CONFIG).listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

/**
 *
 * @param {string | undefined} envConfig
 * @param {string | undefined} fileConfig
 */
function readConfig(envConfig, fileConfig) {
  if (envConfig) {
    return parseConfig(envConfig);
  }
  if (!fileConfig) {
    throw new Error(
      `environment variable PROXYBEEZ_CONFIG and PROXYBEEZ_CONFIG_FILE are both empty; please set either one`
    );
  }
  let fileContent;
  try {
    fileContent = fs.readFileSync(fileConfig).toString();
  } catch (err) {
    throw new Error(
      `environment variable PROXYBEEZ_CONFIG is empty and PROXYBEEZ_CONFIG_FILE is '${fileConfig}' which does not point to a file that could be read: ${err.message}`
    );
  }
  return parseConfig(fileContent);
}

/**
 *
 * @param {unknown} stringConfig
 */
function parseConfig(stringConfig) {
  try {
    return typecheckConfig(JSON.parse(String(stringConfig)));
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`Cannot parse config as JSON: ${err.message}`);
    } else {
      throw err;
    }
  }
}
