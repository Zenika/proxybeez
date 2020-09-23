import * as http from "http";
import * as requestProcessors from "./request-processors.js";
import * as responseProcessors from "./response-processors.js";
import { okJsonRequest } from "./http-client.js";

const CONFIG = parseConfig(process.env.PROXYBEEZ_CONFIG);

export function createServer() {
  return http.createServer(handleRequest);
}

async function handleRequest(req, res) {
  try {
    const incomingUrl = new URL(req.url, "http://example.com");
    const pathConfig = CONFIG.requests[incomingUrl.pathname];
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
      outgoingUrl = renderOutgoingUrl(
        CONFIG.alibeez.baseUrl,
        pathConfig.url,
        incomingUrl.searchParams
      );
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
    const responses = await requestAlibeezTenants(
      outgoingUrl,
      CONFIG.alibeez.tenants
    );
    const response = mergeTenantResponses(responses);
    res.writeHead(200);
    res.write(JSON.stringify(response));
    res.end();
  } catch (err) {
    res.writeHead(500);
    res.write(JSON.stringify({ error: true, message: err.message }));
    res.end();
  }
}

function parseConfig(stringConfig) {
  try {
    return JSON.parse(stringConfig);
  } catch (err) {
    throw new Error(`Cannot parse config as JSON: ${err.message}`);
  }
}

/**
 *
 * @param {string} baseUrl
 * @param {string} template
 * @param {URLSearchParams} params
 * @returns {string}
 */
function renderOutgoingUrl(baseUrl, template, params) {
  return (
    baseUrl + renderTemplate(template, convertSearchParamsToObject(params))
  );
}

/**
 *
 * @param {URLSearchParams} searchParams
 * @returns {object}
 */
function convertSearchParamsToObject(searchParams) {
  const result = {};
  for (const key of searchParams.keys()) {
    result[key] = searchParams.getAll(key);
  }
  return result;
}

/**
 *
 * @param {string} template
 * @param {object} vars
 * @returns {string}
 */
function renderTemplate(template, vars) {
  return template.replace(/\${(.*?)}/g, (_, $1) => {
    if ($1 in vars) {
      return vars[$1];
    } else {
      throw Object.assign(
        new Error(`Cannot render template: missing value for key '${$1}'`),
        { key: $1 }
      );
    }
  });
}

/**
 *
 * @param {string} url
 * @param {object} tenants
 */
function requestAlibeezTenants(url, tenants) {
  return asyncMap(
    Object.values(tenants),
    async ({ requestProcessors = [], responseProcessors = [] }) => {
      const processedUrl = requestProcessors.reduce(runRequestProcessor, url);
      const response = await requestAlibeezTenant(processedUrl);
      const processedResponse = responseProcessors.reduce(
        runResponseProcessors,
        response
      );
      return processedResponse;
    }
  );
}

/**
 *
 * @template T, R
 * @param {Iterable<T>} arr
 * @param {(t: T) => R} fn
 * @returns {Promise<Array<R>>}
 */
async function asyncMap(arr, fn) {
  const results = [];
  for (const element of arr) {
    results.push(await fn(element));
  }
  return results;
}

function runRequestProcessor(url, processorConfig) {
  const [id, config] = Object.entries(processorConfig)[0];
  return requestProcessors[id](url, config);
}

function runResponseProcessors(response, processorConfig) {
  const [id, config] = Object.entries(processorConfig)[0];
  return responseProcessors[id](response, config);
}

function requestAlibeezTenant(url) {
  return okJsonRequest(url);
}

function mergeTenantResponses(responses) {
  return responses.flatMap((response) => response.result);
}
