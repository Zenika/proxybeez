type Config = {
  alibeez: AlibeezConfig;
  paths: PathsConfig;
};

type AlibeezConfig = {
  baseUrl: URL;
  tenants: TenantsConfig;
};

type TenantsConfig = {
  [key: string]: TenantConfig;
};

type TenantConfig = {
  processors?: ProcessorsConfig;
};

type ProcessorsConfig = {
  request?: RequestProcessorConfig[];
  response?: ResponseProcessorConfig[];
};

type RequestProcessorConfig = InsertKeyConfig | ExcludeFieldsConfig;

type InsertKeyConfig = {
  insertKey: string;
};

type ExcludeFieldsConfig = {
  excludeFields: string[];
};

type ResponseProcessorConfig =
  | DefaultFieldsConfig
  | FilterEmailAddressesOfEmployeesConfig;

type DefaultFieldsConfig = {
  defaultFields: object;
};

type FilterEmailAddressesOfEmployeesConfig = {
  filterEmailAddressesOfEmployees: string;
};

type PathsConfig = {
  [key: string]: PathConfig;
};

type PathConfig = {
  key: string;
  path: string;
  mock?: unknown;
  processors?: ProcessorsConfig;
  tenants?: string[];
};
