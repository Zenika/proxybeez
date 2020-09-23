import { createServer } from "./server.js";

const PORT = process.env.PORT || 3000;
const CONFIG = parseConfig(process.env.PROXYBEEZ_CONFIG);

createServer(CONFIG).listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

function parseConfig(stringConfig) {
  try {
    return JSON.parse(stringConfig);
  } catch (err) {
    throw new Error(`Cannot parse config as JSON: ${err.message}`);
  }
}
