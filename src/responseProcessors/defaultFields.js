import deepDefaults from "../utils/deepDefaults.js";

/**
 *
 * @param {AlibeezResponse} response
 * @param {object} defaultValues
 * @returns {AlibeezResponse}
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
