import asyncMap from "./utils/asyncMap.js";
import request from "./utils/httpClient.js";
import * as requestProcessors from "./requestProcessors/requestProcessors.js";
import * as responseProcessors from "./responseProcessors/responseProcessors.js";

/**
 *
 * @param {string} url
 * @param {import("./config.js").AlibeezConfig} config
 */
export async function requestAlibeez(url, config) {
  return mergeTenantResponses(
    await requestAlibeezTenants(new URL(url, config.baseUrl), config.tenants)
  );
}

/**
 *
 * @param {URL} url
 * @param {import("./config.js").TenantsConfig} tenants
 */
function requestAlibeezTenants(url, tenants) {
  return asyncMap(Object.values(tenants), requestAlibeezTenant(url));
}

/**
 * @typedef {{ result?: { [key: string]: unknown }[] }} AlibeezResponse
 *
 * @param {URL} url
 * @returns {(tenant: import("./config.js").TenantConfig) => any}
 */
function requestAlibeezTenant(url) {
  return async (tenant) => {
    const processedUrl = runProcessors(
      url,
      tenant.requestProcessors,
      requestProcessors
    );
    /** @type {AlibeezResponse} */
    const response = await request(processedUrl);
    const processedResponse = runProcessors(
      response,
      tenant.responseProcessors,
      responseProcessors
    );
    return processedResponse;
  };
}

/**
 *
 * @template {unknown} T
 * @param {T} initialInput
 * @param {(import("./config.js").RequestProcessorConfig | import("./config.js").ResponseProcessorConfig)[]} configs
 * @param {{ [id: string]: (t: T, config: any) => T}} processors
 */
function runProcessors(initialInput, configs = [], processors) {
  return configs.reduce((input, config) => {
    const [id, arg] = Object.entries(config)[0];
    return processors[id](input, arg);
  }, initialInput);
}

/**
 *
 * @param {AlibeezResponse[]} responses
 * @returns {unknown[]}
 */
function mergeTenantResponses(responses) {
  return responses.flatMap((response) => response.result ?? []);
}
