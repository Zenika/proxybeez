import * as http from "http";
import * as querystring from "querystring";
import { requestAlibeez } from "./alibeez.js";
import {
  ok,
  badRequest,
  notFound,
  unauthorized,
  serverError,
} from "./utils/httpServer.js";
import interpolate from "./utils/interpolate.js";

export function createServer(config) {
  return http.createServer(handleRequest(config));
}

const handleRequest = (config) => async (req, res) => {
  try {
    const incomingUrl = new URL(req.url, "http://example.com");
    const pathConfig = config.requests[incomingUrl.pathname];
    if (!pathConfig) {
      return notFound(res);
    }
    if (req.headers.authorization !== `Bearer ${pathConfig.key}`) {
      return unauthorized(res);
    }
    let outgoingUrl;
    try {
      outgoingUrl = renderOutgoingUrl(pathConfig.url, incomingUrl.searchParams);
    } catch (err) {
      return badRequest(res, `Missing query parameter: ${err.key}`);
    }
    if (pathConfig.mock) {
      return ok(res, pathConfig.mock);
    }
    const response = await requestAlibeez(outgoingUrl, config.alibeez);
    return ok(res, response);
  } catch (err) {
    return serverError(res, req, err);
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
