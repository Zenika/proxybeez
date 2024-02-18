import * as http from "http";
import * as jose from "jose";
import { requestAlibeez } from "./alibeez.js";
import {
  ok,
  badRequest,
  notFound,
  unauthorized,
  serverError,
  cors,
} from "./utils/httpServer.js";
import renderPathTemplate, {
  RenderPathTemplateMissingValue,
} from "./renderPathTemplate.js";
import { HttpClientError } from "./utils/httpClient.js";

/**
 *
 * @param {Config} config
 */
export function createServer(config) {
  return http.createServer(handleRequest(config));
}

/**
 *
 * @param {Config} config
 * @returns {http.RequestListener}
 */
const handleRequest = (config) => async (req, res) => {
  try {
    const incomingUrl = new URL(
      req.url || "/",
      "http://example.com" /* this value is not important */
    );
    if (req.method === "OPTIONS") {
      return cors(res);
    }
    const pathConfig = config.paths[incomingUrl.pathname];
    if (!pathConfig) {
      return notFound(res);
    }
    if (
      pathConfig.key !== "jwt" &&
      req.headers.authorization !== `Bearer ${pathConfig.key}`
    ) {
      return unauthorized(res);
    }
    if (pathConfig.key === "jwt") {
      const googleJwks = jose.createRemoteJWKSet(
        new URL("https://www.googleapis.com/oauth2/v3/certs")
      );
      const jwt = req.headers.authorization?.substring("Bearer ".length);
      try {
        const { payload } = await jose.jwtVerify(jwt, googleJwks, {
          issuer: "https://accounts.google.com",
        });
        incomingUrl.searchParams.set("jwtEmail", payload.email);
      } catch (err) {
        console.warn("error while verifying jwt:", err);
        return unauthorized(res);
      }
    }
    if (pathConfig.mock) {
      return ok(res, pathConfig.mock);
    }
    const outgoingUrl = renderPathTemplate(
      pathConfig.path,
      incomingUrl.searchParams
    );
    const response = await requestAlibeez(
      outgoingUrl,
      config.alibeez,
      pathConfig
    );
    return ok(res, response);
  } catch (err) {
    if (err instanceof RenderPathTemplateMissingValue) {
      return badRequest(res, `Missing query parameter: ${err.key}`);
    } else if (
      err instanceof HttpClientError &&
      err.statusCode &&
      err.statusCode >= 400 &&
      err.statusCode < 500
    ) {
      return err.forward(res);
    }
    return serverError(res, req, err);
  }
};
