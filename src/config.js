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
 *   requestProcessors?: RequestProcessorConfig[],
 *   responseProcessors?: ResponseProcessorConfig[]
 * }} TenantConfig
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
 * @typedef {DefaultFieldsConfig} ResponseProcessorConfig
 *
 * @typedef {{
 *   defaultFields: object
 * }} DefaultFieldsConfig
 *
 * @typedef {{
 *   [key: string]: PathConfig
 * }} PathsConfig
 *
 * @typedef {{
 *   key: string,
 *   path: string,
 *   mock?: unknown
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
  if (hasProperty(config, "requestProcessors")) {
    if (!isArray(config.requestProcessors)) {
      throw new TypeError(
        "Invalid configuration: one of $.alibeez.tenants[*].requestProcessors is not an array"
      );
    }
    result.requestProcessors = config.requestProcessors.map(
      typecheckRequestProcessor
    );
  }
  if (hasProperty(config, "responseProcessors")) {
    if (!isArray(config.responseProcessors)) {
      throw new TypeError(
        "Invalid configuration: one of $.alibeez.tenants[*].responseProcessors is not an array"
      );
    }
    result.responseProcessors = config.responseProcessors.map(
      typecheckResponseProcessor
    );
  }
  return result;
}

/**
 * @param {unknown} config
 * @returns {RequestProcessorConfig}
 */
function typecheckRequestProcessor(config) {
  if (!isRecord(config)) {
    throw new TypeError(
      "Invalid configuration: one of $.alibeez.tenants[*].requestProcessors[*] is not an object"
    );
  }
  if (hasProperty(config, "excludeFields")) {
    return typecheckExcludeFieldsConfig(config);
  } else if (hasProperty(config, "insertKey")) {
    return typecheckInsertKeyConfig(config);
  } else {
    throw new TypeError(
      "Invalid configuration: one of $.alibeez.tenants[*].requestProcessors[*] is not a supported processor"
    );
  }
}

/**
 * @param {{ excludeFields: unknown }} config
 * @returns {ExcludeFieldsConfig}
 */
function typecheckExcludeFieldsConfig(config) {
  if (!isArray(config.excludeFields)) {
    throw new TypeError(
      "Invalid configuration: one of $.alibeez.tenants[*].requestProcessors[*].excludeFields is not an array"
    );
  }
  const excludeFields = config.excludeFields.map((field) => {
    if (typeof field !== "string") {
      throw new TypeError(
        "Invalid configuration: one of $.alibeez.tenants[*].requestProcessors[*].excludeFields[*] is not a string"
      );
    }
    return field;
  });
  return { excludeFields };
}

/**
 * @param {{ insertKey: unknown }} config
 * @returns {InsertKeyConfig}
 */
function typecheckInsertKeyConfig({ insertKey }) {
  if (typeof insertKey !== "string") {
    throw new TypeError(
      "Invalid configuration: one of $.alibeez.tenants[*].requestProcessors[*].insertKey is not a string"
    );
  }
  return { insertKey };
}

/**
 * @param {unknown} config
 * @returns {ResponseProcessorConfig}
 */
function typecheckResponseProcessor(config) {
  if (!isRecord(config)) {
    throw new TypeError(
      "Invalid configuration: one of $.alibeez.tenants[*].responseProcessors[*] is not an object"
    );
  }
  if (hasProperty(config, "defaultFields")) {
    return typecheckDefaultFieldsConfig(config);
  } else {
    throw new TypeError(
      "Invalid configuration: one of $.alibeez.tenants[*].responseProcessors[*] is not a supported processor"
    );
  }
}

/**
 * @param {{ defaultFields: unknown }} config
 * @returns {DefaultFieldsConfig}
 */
function typecheckDefaultFieldsConfig({ defaultFields }) {
  if (!isRecord(defaultFields)) {
    throw new TypeError(
      "Invalid configuration: one of $.alibeez.tenants[*].responseProcessors[*].defaultFields is not an object"
    );
  }
  return { defaultFields };
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
  const { key, path } = config;
  if (hasProperty(config, "mock")) {
    return { key, path, mock: config.mock };
  } else {
    return { key, path };
  }
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
