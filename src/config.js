/**
 * @typedef {{
 *   alibeez: AlibeezConfig,
 *   paths: PathsConfig
 * }} Config
 *
 * @typedef {{
 *   baseUrl: URL,
 *   tenants: TenantsConfig
 * }} AlibeezConfig
 *
 * @typedef {{
 *   [key: string]: TenantConfig
 * }} TenantsConfig
 *
 * @typedef {{
 *   processors?: ProcessorsConfig
 * }} TenantConfig
 *
 * @typedef {{
 *   request?: RequestProcessorConfig[],
 *   response?: ResponseProcessorConfig[]
 * }} ProcessorsConfig
 *
 * @typedef {InsertKeyConfig | ExcludeFieldsConfig} RequestProcessorConfig
 *
 * @typedef {{
 *   insertKey: string
 * }} InsertKeyConfig
 *
 * @typedef {{
 *   excludeFields: string[]
 * }} ExcludeFieldsConfig
 *
 * @typedef {DefaultFieldsConfig | FilterEmailAddressesOfEmployeesConfig} ResponseProcessorConfig
 *
 * @typedef {{
 *   defaultFields: object
 * }} DefaultFieldsConfig
 *
 * @typedef {{
 *   filterEmailAddressesOfEmployees: string
 * }} FilterEmailAddressesOfEmployeesConfig
 *
 * @typedef {{
 *   [key: string]: PathConfig
 * }} PathsConfig
 *
 * @typedef {{
 *   key: string,
 *   path: string,
 *   mock?: unknown,
 *   processors?: ProcessorsConfig
 * }} PathConfig
 */

/**
 *
 * @param {unknown} config
 * @returns {Config}
 */
export function typecheckConfig(config) {
  if (!isRecord(config)) {
    throw new TypeError("config is not an object");
  }
  if (!hasProperty(config, "alibeez")) {
    throw new TypeError("Invalid configuration: $.alibeez is missing");
  }
  if (!hasProperty(config, "paths")) {
    throw new TypeError("Invalid configuration: $.paths is missing");
  }
  return {
    alibeez: typecheckAlibeezConfig(config.alibeez),
    paths: typecheckPathsConfig(config.paths),
  };
}

/**
 * @param {unknown} config
 * @returns {AlibeezConfig}
 */
function typecheckAlibeezConfig(config) {
  if (!isRecord(config)) {
    throw new TypeError("Invalid configuration: $.alibeez is not an object");
  }
  if (!hasProperty(config, "baseUrl")) {
    throw new TypeError("Invalid configuration: $.alibeez.baseUrl is missing");
  }
  if (typeof config.baseUrl !== "string") {
    throw new TypeError(
      "Invalid configuration: $.alibeez.baseUrl is not a string"
    );
  }
  if (!hasProperty(config, "tenants")) {
    throw new TypeError("Invalid configuration: $.tenants is missing");
  }
  return {
    baseUrl: new URL(config.baseUrl),
    tenants: typecheckTenantsConfig(config.tenants),
  };
}

/**
 * @param {unknown} config
 * @returns {TenantsConfig}
 */
function typecheckTenantsConfig(config) {
  if (!isRecord(config)) {
    throw new TypeError("Invalid configuration: $.tenants is not an object");
  }
  /** @type TenantsConfig */ const result = {};
  for (const [key, value] of Object.entries(config)) {
    result[key] = typecheckTenantConfig(value);
  }
  return result;
}

/**
 * @param {unknown} config
 * @returns {TenantConfig}
 */
function typecheckTenantConfig(config) {
  /** @type TenantConfig */ const result = {};
  if (!isRecord(config)) {
    throw new TypeError(
      "Invalid configuration: one of $.alibeez.tenants[*] is not an object"
    );
  }
  if (hasProperty(config, "processors")) {
    result.processors = typecheckProcessorsConfig(
      config.processors,
      "one of $.alibeez.tenants[*].processors"
    );
  }
  return result;
}

/**
 * @param {unknown} config
 * @param {string} path of where the config is in the global config
 * @returns {ProcessorsConfig}
 */
function typecheckProcessorsConfig(config, path) {
  /** @type ProcessorsConfig */ const result = {};
  if (!isRecord(config)) {
    throw new TypeError(`Invalid configuration: ${path} is not an object`);
  }
  if (hasProperty(config, "request")) {
    if (!isArray(config.request)) {
      throw new TypeError(
        `Invalid configuration: ${path}.request is not an array`
      );
    }
    result.request = config.request.map((requestProcessorConfig) =>
      typecheckRequestProcessorConfig(requestProcessorConfig, path)
    );
  }
  if (hasProperty(config, "response")) {
    if (!isArray(config.response)) {
      throw new TypeError(
        `Invalid configuration: ${path}.response is not an array`
      );
    }
    result.response = config.response.map((responseProcessorConfig) =>
      typecheckResponseProcessorConfig(responseProcessorConfig, path)
    );
  }
  return result;
}

/**
 * @param {unknown} config
 * @param {string} path of where the processors config is in the global config
 * @returns {RequestProcessorConfig}
 */
function typecheckRequestProcessorConfig(config, path) {
  if (!isRecord(config)) {
    throw new TypeError(
      `Invalid configuration: ${path}.request[*] is not an object`
    );
  }
  if (hasProperty(config, "excludeFields")) {
    return typecheckExcludeFieldsConfig(config, path);
  } else if (hasProperty(config, "insertKey")) {
    return typecheckInsertKeyConfig(config, path);
  } else {
    throw new TypeError(
      `Invalid configuration: ${path}.request[*] is not a supported processor: ${JSON.stringify(
        config
      )}`
    );
  }
}

/**
 * @param {{ excludeFields: unknown }} config
 * @param {string} path of where the processors config is in the global config
 * @returns {ExcludeFieldsConfig}
 */
function typecheckExcludeFieldsConfig(config, path) {
  if (!isArray(config.excludeFields)) {
    throw new TypeError(
      `Invalid configuration: ${path}.request[*].excludeFields is not an array`
    );
  }
  const excludeFields = config.excludeFields.map((field) => {
    if (typeof field !== "string") {
      throw new TypeError(
        `Invalid configuration: ${path}.request[*].excludeFields[*] is not a string`
      );
    }
    return field;
  });
  return { excludeFields };
}

/**
 * @param {{ insertKey: unknown }} config
 * @param {string} path of where the processors config is in the global config
 * @returns {InsertKeyConfig}
 */
function typecheckInsertKeyConfig({ insertKey }, path) {
  if (typeof insertKey !== "string") {
    throw new TypeError(
      `Invalid configuration: ${path}.request[*].insertKey is not a string`
    );
  }
  return { insertKey };
}

/**
 * @param {unknown} config
 * @param {string} path of where the processors config is in the global config
 * @returns {ResponseProcessorConfig}
 */
function typecheckResponseProcessorConfig(config, path) {
  if (!isRecord(config)) {
    throw new TypeError(
      `Invalid configuration: ${path}.response[*] is not an object`
    );
  }
  if (hasProperty(config, "defaultFields")) {
    return typecheckDefaultFieldsConfig(config, path);
  } else if (hasProperty(config, "filterEmailAddressesOfEmployees")) {
    return typecheckFilterEmailAddressesOfEmployeesConfig(config, path);
  } else {
    throw new TypeError(
      `Invalid configuration: ${path}.response[*] is not a supported processor: ${JSON.stringify(
        config
      )}`
    );
  }
}

/**
 * @param {{ defaultFields: unknown }} config
 * @param {string} path of where the processors config is in the global config
 * @returns {DefaultFieldsConfig}
 */
function typecheckDefaultFieldsConfig({ defaultFields }, path) {
  if (!isRecord(defaultFields)) {
    throw new TypeError(
      `Invalid configuration: ${path}.response[*].defaultFields is not an object`
    );
  }
  return { defaultFields };
}

/**
 * @param {{ filterEmailAddressesOfEmployees: unknown }} config
 * @param {string} path of where the processors config is in the global config
 * @returns {FilterEmailAddressesOfEmployeesConfig}
 */
function typecheckFilterEmailAddressesOfEmployeesConfig(
  { filterEmailAddressesOfEmployees },
  path
) {
  if (typeof filterEmailAddressesOfEmployees !== "string") {
    throw new TypeError(
      `Invalid configuration: ${path}.response[*].filterEmailAddressesOfEmployeesConfig is not a string`
    );
  }
  return { filterEmailAddressesOfEmployees };
}

/**
 * @param {unknown} config
 * @returns {PathsConfig}
 */
function typecheckPathsConfig(config) {
  if (!isRecord(config)) {
    throw new TypeError("Invalid configuration: $.paths is not an object");
  }
  /** @type PathsConfig */ const result = {};
  for (const [key, value] of Object.entries(config)) {
    result[key] = typecheckPathConfig(value);
  }
  return result;
}

/**
 * @param {unknown} config
 * @returns {PathConfig}
 */
function typecheckPathConfig(config) {
  if (!isRecord(config)) {
    throw new TypeError(
      "Invalid configuration: one of $.paths[*] is not an object"
    );
  }
  if (!hasProperty(config, "key")) {
    throw new TypeError(
      "Invalid configuration: one of $.paths[*].key is missing"
    );
  }
  if (typeof config.key !== "string") {
    throw new TypeError(
      "Invalid configuration: one of $.paths[*].key is not an string"
    );
  }
  if (!hasProperty(config, "path")) {
    throw new TypeError(
      "Invalid configuration: one of $.paths[*].path is missing"
    );
  }
  if (typeof config.path !== "string") {
    throw new TypeError(
      "Invalid configuration: one of $.paths[*].path is not an string"
    );
  }
  /** @type PathConfig */ const result = { key: config.key, path: config.path };
  if (hasProperty(config, "processors")) {
    result.processors = typecheckProcessorsConfig(
      config.processors,
      "one of $.paths[*].processors"
    );
  }
  if (hasProperty(config, "mock")) {
    result.mock = config.mock;
  }
  return result;
}

/**
 * NOTE: might seem redundant but actually useful because
 * Array.isArray casts to any[] while this casts to unknown[]
 * which is safer.
 *
 * @param {unknown} value
 * @returns {value is unknown[]}
 */
export function isArray(value) {
  return Array.isArray(value);
}

/**
 *
 * @param {unknown} value
 * @returns {value is object}
 */
export function isRecord(value) {
  return typeof value === "object" && value !== null && !isArray(value);
}

/**
 * @template {string} Key
 * @param {object} value
 * @param {Key} key
 * @returns {value is { [K in Key]: unknown }}
 */
export function hasProperty(value, key) {
  return key in value;
}
