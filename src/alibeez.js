import asyncMap from "./utils/asyncMap.js";
import request from "./utils/httpClient.js";
import runProcessors from "./runProcessors.js";
import * as requestProcessorLibrary from "./requestProcessors/requestProcessors.js";
import * as responseProcessorLibrary from "./responseProcessors/responseProcessors.js";

/**
 *
 * @param {string} url
 * @param {AlibeezConfig} alibeezConfig
 * @param {PathConfig} pathConfig
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
 * @param {TenantsConfig} tenants
 * @param {PathConfig} pathConfig
 */
function requestAlibeezTenants(url, tenants, pathConfig) {
  return asyncMap(
    Object.entries(tenants)
      .filter(
        ([name]) => !pathConfig.tenants || pathConfig.tenants.includes(name)
      )
      .map(([, tenant]) =>
        mergeProcessors(tenant.processors, pathConfig.processors)
      ),
    requestAlibeezTenant(url)
  );
}

/**
 *
 * @param {ProcessorsConfig=} headProcessors
 * @param {ProcessorsConfig=} tailProcessors
 * @returns {ProcessorsConfig}
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
 * @param {URL} url
 * @returns {AlibeezRequester}
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
