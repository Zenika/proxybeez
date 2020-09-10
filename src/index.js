import { createServer } from "./server.js";

const port = process.env.PORT || 3000;

createServer().listen(port, () => {
  console.log(`Listening on port ${port}`);
});
