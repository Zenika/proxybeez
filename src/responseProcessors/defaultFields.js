import deepDefaults from "../utils/deepDefaults.js";

/**
 *
 * @param {object} response
 * @param {object} defaultValues
 * @returns {object}
 */
export function defaultFields(response, defaultValues) {
  const resultWithDefaults = response.result.map((result) => {
    return deepDefaults(result, defaultValues);
  });
  return {
    ...response,
    result: resultWithDefaults,
  };
}
