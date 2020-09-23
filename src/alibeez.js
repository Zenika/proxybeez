import asyncMap from "./utils/asyncMap.js";
import request from "./utils/httpClient.js";
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
  return async (tenant) => {
    const processedUrl = runProcessors(
      url,
      tenant.requestProcessors,
      requestProcessors
    );
    const response = await request(processedUrl);
    const processedResponse = runProcessors(
      response,
      tenant.responseProcessors,
      responseProcessors
    );
    return processedResponse;
  };
}

function runProcessors(initialInput, configs = [], processors) {
  return configs.reduce((input, config) => {
    const [id, arg] = Object.entries(config)[0];
    return processors[id](input, arg);
  }, initialInput);
}

function mergeTenantResponses(responses) {
  return responses.flatMap((response) => response.result);
}
