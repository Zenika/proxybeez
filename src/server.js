import * as http from "http";
import { requestAlibeez } from "./alibeez.js";
import {
  ok,
  badRequest,
  notFound,
  unauthorized,
  serverError,
} from "./utils/httpServer.js";
import renderPathTemplate from "./renderPathTemplate.js";

export function createServer(config) {
  return http.createServer(handleRequest(config));
}

const handleRequest = (config) => async (req, res) => {
  try {
    const incomingUrl = new URL(
      req.url,
      "http://example.com" /* this value is not important */
    );
    const pathConfig = config.requests[incomingUrl.pathname];
    if (!pathConfig) {
      return notFound(res);
    }
    if (req.headers.authorization !== `Bearer ${pathConfig.key}`) {
      return unauthorized(res);
    }
    let outgoingUrl;
    try {
      outgoingUrl = renderPathTemplate(
        pathConfig.path,
        incomingUrl.searchParams
      );
    } catch (err) {
      if (err.key) {
        return badRequest(res, `Missing query parameter: ${err.key}`);
      } else {
        throw err;
      }
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
