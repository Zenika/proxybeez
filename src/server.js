import * as http from "http";
import { parse as parseUrl } from "url";
import { okJsonRequest } from "./http-client.js";
import {
  asyncFlatMap,
  computeUrlWithKey,
  parseAlibeezParamsFromQuery,
} from "./utils.js";

const CONFIG = JSON.parse(process.env.PROXYBEEZ_CONFIG);
const ALIBEEZ_API_ROOT_URL = process.env.ALIBEEZ_API_ROOT_URL;
if (!ALIBEEZ_API_ROOT_URL) {
  throw new Error(
    `Environment variable ALIBEEZ_API_ROOT_URL: expected non-empty string but found '${process.env.ALIBEEZ_API_ROOT_URL}'`
  );
}
const ALIBEEZ_KEYS = JSON.parse(process.env.ALIBEEZ_KEYS);
if (ALIBEEZ_KEYS.length === 0) {
  throw new Error(
    `Environment variable ALIBEEZ_KEYS: expected non-empty comma-separated list of strings but found '${process.env.ALIBEEZ_KEYS}'`
  );
}

const handleAlibeezRequest = async ({ url, query, sortBy }) => {
  const alibeezParams = parseAlibeezParamsFromQuery(query);
  const results = await asyncFlatMap(ALIBEEZ_KEYS, async ({ key, ignore }) => {
    const urlWithKey = computeUrlWithKey(
      ALIBEEZ_API_ROOT_URL,
      url,
      alibeezParams,
      ignore,
      key
    );
    const { result } = await okJsonRequest(urlWithKey);
    return result;
  });
  if (sortBy) {
    results.sort((result1, result2) => {
      return result1[sortBy].localeCompare(result2[sortBy]);
    });
  }
  return results;
};

export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      if (req.method !== "GET") {
        res.writeHead(405).end();
        return;
      }
      const { pathname, query } = parseUrl(req.url);
      const { key, url, sortBy } = CONFIG[pathname] || {};
      if (!key || !url) {
        res.writeHead(404).end();
        return;
      }
      if (req.headers.authorization !== `Bearer ${key}`) {
        res.writeHead(401).end();
        return;
      }
      res.writeHead(200);
      res.write(
        JSON.stringify(await handleAlibeezRequest({ url, query, sortBy }))
      );
      res.end();
    } catch (err) {
      console.error(
        `ERROR: Could not handle request '${req.method} ${req.url}'`,
        err
      );
      if (err.response) {
        res.writeHead(err.response.statusCode);
        res.write(
          JSON.stringify({ message: err.message, error: err.response.body })
        );
        res.end();
        return;
      }
      res.writeHead(500).end();
    }
  });
}
