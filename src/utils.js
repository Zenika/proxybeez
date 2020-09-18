import { parse as parseQuerystring } from "querystring";
import { parse as parseUrl } from "url";

export async function asyncFlatMap(arr, fn) {
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

export const computeUrlWithKey = (
  baseUrl,
  configUrl,
  alibeezParams,
  ignore,
  key
) => {
  const { pathname } = parseUrl(configUrl);
  const { filter, fields } = parseQuerystring(parseUrl(configUrl).query);
  const urlWithKey = new URL(`${baseUrl}${pathname}`);
  const filterList = (typeof filter === "string"
    ? [filter]
    : filter
  ).map((filter) => renderTemplate(filter, alibeezParams));
  const fieldsList = fields
    .split(",")
    .filter((field) => !ignore.includes(field));
  filterList.forEach((filter) =>
    urlWithKey.searchParams.append("filter", filter)
  );
  urlWithKey.searchParams.set("fields", fieldsList.join(","));
  urlWithKey.searchParams.set("key", key);
  return urlWithKey;
};
