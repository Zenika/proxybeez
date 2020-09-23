import * as http from "http";

/**
 *
 * @param {http.ServerResponse} res
 * @param {*} body
 * @returns {http.ServerResponse}
 */
export function ok(res, body) {
  res.writeHead(200);
  res.write(JSON.stringify(body));
  res.end();
  return res;
}

/**
 *
 * @param {http.ServerResponse} res
 * @param {Error} err
 * @returns {http.ServerResponse}
 */
export function serverError(res, req, err) {
  console.error(`ERROR: while handling '${req.url}'`, err);
  res.writeHead(500);
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
  res.writeHead(400);
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
  res.writeHead(404);
  res.end();
  return res;
}

/**
 *
 * @param {http.ServerResponse} res
 * @returns {http.ServerResponse}
 */
export function notFound(res) {
  res.writeHead(404);
  res.end();
  return res;
}
