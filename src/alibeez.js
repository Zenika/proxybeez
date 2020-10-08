import asyncMap from "./utils/asyncMap.js";
import request from "./utils/httpClient.js";
import runProcessors from "./runProcessors.js";
import * as requestProcessorLibrary from "./requestProcessors/requestProcessors.js";
import * as responseProcessorLibrary from "./responseProcessors/responseProcessors.js";

/**
 *
 * @param {string} url
 * @param {import("./config.js").AlibeezConfig} alibeezConfig
 * @param {import("./config.js").PathConfig} pathConfig
 */
export async function requestAlibeez(url, alibeezConfig, pathConfig) {
  return mergeTenantResponses(
    await requestAlibeezTenants(
      new URL(alibeezConfig.baseUrl.pathname + url, alibeezConfig.baseUrl),
      alibeezConfig.tenants,
      pathConfig
    )
  );
}

/**
 *
 * @param {URL} url
 * @param {import("./config.js").TenantsConfig} tenants
 * @param {import("./config.js").PathConfig} pathConfig
 */
function requestAlibeezTenants(url, tenants, pathConfig) {
  return asyncMap(
    Object.values(tenants).map((tenant) =>
      mergeProcessors(tenant.processors, pathConfig.processors)
    ),
    requestAlibeezTenant(url)
  );
}

/**
 *
 * @param {import("./config.js").ProcessorsConfig=} headProcessors
 * @param {import("./config.js").ProcessorsConfig=} tailProcessors
 * @returns {import("./config.js").ProcessorsConfig}
 */
function mergeProcessors(headProcessors = {}, tailProcessors = {}) {
  return {
    request: [
      ...(headProcessors.request ?? []),
      ...(tailProcessors.request ?? []),
    ],
    response: [
      ...(headProcessors.response ?? []),
      ...(tailProcessors.response ?? []),
    ],
  };
}

/**
 * @typedef {{ result?: { [key: string]: unknown }[] }} AlibeezResponse
 *
 * @param {URL} url
 * @returns {(processorsConfig: import("./config.js").ProcessorsConfig) => Promise<AlibeezResponse>}
 */
function requestAlibeezTenant(url) {
  return async (processors) => {
    const processedUrl = runProcessors(
      url,
      processors.request,
      requestProcessorLibrary
    );
    /** @type {AlibeezResponse} */
    const response = await request(processedUrl);
    const processedResponse = runProcessors(
      response,
      processors.response,
      responseProcessorLibrary
    );
    return processedResponse;
  };
}

/**
 *
 * @param {AlibeezResponse[]} responses
 * @returns {unknown[]}
 */
function mergeTenantResponses(responses) {
  return responses.flatMap((response) => response.result ?? []);
}
