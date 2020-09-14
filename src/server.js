import * as http from "http";
import { parse as parseUrl, format as formatUrl } from "url";
import {
  parse as parseQuerystring,
  stringify as stringifyQuerystring,
} from "querystring";
import { okJsonRequest } from "./http-client.js";
import { parseAlibeezParamsFromQuery } from "./utils.js";
import { memoize } from "./memoize.js";

const CONFIG = JSON.parse(process.env.PROXYBEEZ_CONFIG);
const ALIBEEZ_API_ROOT_URL = process.env.ALIBEEZ_API_ROOT_URL;
if (!ALIBEEZ_API_ROOT_URL) {
  throw new Error(
    `Environment variable ALIBEEZ_API_ROOT_URL: expected non-empty string but found '${process.env.ALIBEEZ_API_ROOT_URL}'`
  );
}
const ALIBEEZ_KEYS = (process.env.ALIBEEZ_KEYS || "").split(",");
if (ALIBEEZ_KEYS.length === 0) {
  throw new Error(
    `Environment variable ALIBEEZ_KEYS: expected non-empty comma-separated list of strings but found '${process.env.ALIBEEZ_KEYS}'`
  );
}

const handleAlibeezRequest = async ({ url, query, sortBy }) => {
  const alibeezParams = parseAlibeezParamsFromQuery(query);
  let renderedUrl;
  renderedUrl = renderTemplate(url, alibeezParams);

  const results = await asyncFlatMap(ALIBEEZ_KEYS, async (key) => {
    const parsedUrl = parseUrl(renderedUrl);
    const urlWithKey = formatUrl({
      ...parsedUrl,
      search: stringifyQuerystring({
        ...parseQuerystring(parsedUrl.query),
        key,
      }),
    });
    const { result } = await okJsonRequest(
      `${ALIBEEZ_API_ROOT_URL}${urlWithKey}`
    );
    return result;
  });
  if (sortBy) {
    results.sort((result1, result2) => {
      return result1[sortBy].localeCompare(result2[sortBy]);
    });
  }
  return results;
};

const memoizedHandleAlibeezRequest = memoize(handleAlibeezRequest);

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
      try {
        res.writeHead(200);
        res.write(
          JSON.stringify(
            await memoizedHandleAlibeezRequest({ url, query, sortBy })
          )
        );
        res.end();
      } catch (err) {
        console.error(
          `ERROR: Could not handle request '${req.method} ${req.url}'`,
          err
        );
        res.writeHead(400);
        res.write(JSON.stringify({ error: err.message }));
        res.end();
        return;
      }
    } catch (err) {
      console.error(
        `ERROR: Could not handle request '${req.method} ${req.url}'`,
        err
      );
      res.writeHead(500).end();
    }
  });
}

async function asyncFlatMap(arr, fn) {
  const results = [];
  for (const element of arr) {
    for (const result of await fn(element)) {
      results.push(result);
    }
  }
  return results;
}

function renderTemplate(template, vars) {
  return template.replace(/\${(.*?)}/g, (_, $1) => {
    if ($1 in vars) {
      return vars[$1];
    } else {
      throw new Error(`Cannot render template: missing value for key '${$1}'`);
    }
  });
}
