import deepDefaults from "../utils/deepDefaults.js";

/**
 *
 * @param {import("../alibeez.js").AlibeezResponse} response
 * @param {object} defaultValues
 * @returns {import("../alibeez.js").AlibeezResponse}
 */
export function defaultFields(response, defaultValues) {
  const resultWithDefaults = response.result?.map((result) => {
    return deepDefaults(result, defaultValues);
  });
  return {
    ...response,
    result: resultWithDefaults,
  };
}
