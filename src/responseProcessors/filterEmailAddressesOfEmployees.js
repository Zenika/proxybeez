/**
 *
 * @param {AlibeezResponse} response
 * @param {string} fieldName
 * @returns {AlibeezResponse}
 */
export function filterEmailAddressesOfEmployees(response, fieldName) {
  const filteredResults = response.result?.filter((result) => {
    const fieldValue = result[fieldName];
    return (
      typeof fieldValue === "string" &&
      fieldValue.endsWith("@zenika.com") &&
      fieldValue !== "@zenika.com" &&
      !fieldValue.endsWith("-ext@zenika.com")
    );
  });
  return {
    ...response,
    result: filteredResults,
  };
}
