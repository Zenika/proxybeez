import * as http from "http";
import * as querystring from "querystring";
import { requestAlibeez } from "./alibeez.js";
import interpolate from "./interpolate.js";

export function createServer(config) {
  return http.createServer(handleRequest(config));
}

const handleRequest = (config) => async (req, res) => {
  try {
    const incomingUrl = new URL(req.url, "http://example.com");
    const pathConfig = config.requests[incomingUrl.pathname];
    if (!pathConfig) {
      res.writeHead(404).end();
      return;
    }
    if (req.headers.authorization !== `Bearer ${pathConfig.key}`) {
      res.writeHead(404).end();
      return;
    }
    let outgoingUrl;
    try {
      outgoingUrl = renderOutgoingUrl(pathConfig.url, incomingUrl.searchParams);
    } catch (err) {
      res.writeHead(400);
      res.write(
        JSON.stringify({
          error: true,
          title: "Missing query parameter",
          missingQueryParameter: err.key,
        })
      );
      res.end();
      return;
    }
    if (pathConfig.mock) {
      res.writeHead(200);
      res.write(JSON.stringify(pathConfig.mock));
      res.end();
      return;
    }
    const response = await requestAlibeez(outgoingUrl, config.alibeez);
    res.writeHead(200);
    res.write(JSON.stringify(response));
    res.end();
  } catch (err) {
    res.writeHead(500);
    res.write(JSON.stringify({ error: true, message: err.message }));
    res.end();
  }
};

/**
 *
 * @param {string} template
 * @param {URLSearchParams} params
 * @returns {string}
 */
export function renderOutgoingUrl(template, params) {
  return interpolate(template, convertSearchParamsToObject(params));
}

/**
 *
 * @param {URLSearchParams} searchParams
 * @returns {object}
 */
function convertSearchParamsToObject(searchParams) {
  const result = {};
  for (const key of searchParams.keys()) {
    result[key] = searchParams
      .getAll(key)
      .map((value) => querystring.escape(value));
  }
  return result;
}
