import { typecheckConfig } from "./config.js";
import { createServer } from "./server.js";

const PORT = process.env.PORT || 3000;
const CONFIG = parseConfig(process.env.PROXYBEEZ_CONFIG);

createServer(CONFIG).listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

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
