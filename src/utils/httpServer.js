import * as http from "http";

/**
 *
 * @param {http.ServerResponse} res
 * @param {*} body
 * @returns {http.ServerResponse}
 */
export function ok(res, body) {
  writeHead(res, 200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(body));
  res.end();
  return res;
}

/**
 *
 * @param {http.ServerResponse} res
 * @param {http.IncomingMessage} req
 * @param {Error} err
 * @returns {http.ServerResponse}
 */
export function serverError(res, req, err) {
  console.error(`ERROR: while handling '${req.url}'`, err);
  writeHead(res, 500);
  res.end();
  return res;
}

/**
 *
 * @param {http.ServerResponse} res
 * @param {string} message
 * @returns {http.ServerResponse}
 */
export function badRequest(res, message) {
  writeHead(res, 400);
  res.write(JSON.stringify({ message }));
  res.end();
  return res;
}

/**
 *
 * @param {http.ServerResponse} res
 * @returns {http.ServerResponse}
 */
export function unauthorized(res) {
  // 404 is used on purpose, so that one cannot scan for valid paths.
  writeHead(res, 404);
  res.end();
  return res;
}

/**
 *
 * @param {http.ServerResponse} res
 * @returns {http.ServerResponse}
 */
export function notFound(res) {
  writeHead(res, 404);
  res.end();
  return res;
}

/**
 *
 * @param {http.ServerResponse} res
 * @returns {http.ServerResponse}
 */
export function cors(res) {
  writeHead(res, 204, {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "Authorization",
  });
  res.end();
  return res;
}

/**
 *
 * @param {http.ServerResponse} res
 * @param {number} statusCode
 * @param {http.OutgoingHttpHeaders=} headers
 */
function writeHead(res, statusCode, headers) {
  res.writeHead(statusCode, {
    ...headers,
    "Strict-Transport-Security": "max-age=63072000",
  });
}
