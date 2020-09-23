import asyncMap from "./asyncMap.js";
import request from "./http-client.js";
import * as requestProcessors from "./requestProcessors/requestProcessors.js";
import * as responseProcessors from "./responseProcessors/responseProcessors.js";

/**
 *
 * @param {string} url
 * @param {object} config
 */
export async function requestAlibeez(url, config) {
  return mergeTenantResponses(
    await requestAlibeezTenants(config.baseUrl + url, config.tenants)
  );
}

/**
 *
 * @param {string} url
 * @param {object} tenants
 */
function requestAlibeezTenants(url, tenants) {
  return asyncMap(Object.values(tenants), requestAlibeezTenant(url));
}

function requestAlibeezTenant(url) {
  return async ({ requestProcessors = [], responseProcessors = [] }) => {
    const processedUrl = requestProcessors.reduce(runRequestProcessor, url);
    const response = await request(processedUrl);
    const processedResponse = responseProcessors.reduce(
      runResponseProcessors,
      response
    );
    return processedResponse;
  };
}

function mergeTenantResponses(responses) {
  return responses.flatMap((response) => response.result);
}

function runRequestProcessor(url, processorConfig) {
  const [id, config] = Object.entries(processorConfig)[0];
  return requestProcessors[id](url, config);
}

function runResponseProcessors(response, processorConfig) {
  const [id, config] = Object.entries(processorConfig)[0];
  return responseProcessors[id](response, config);
}
