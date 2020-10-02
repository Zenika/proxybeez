/**
 *
 * @param {string | URL} url
 * @param {string[]} excludedFields
 * @returns {URL}
 */
export function excludeFields(url, excludedFields) {
  const urlCopy = new URL(url.toString());
  const fields = urlCopy.searchParams.get("fields");
  if (!fields) {
    return urlCopy;
  }
  const includedFields = fields
    .split(",")
    .filter((field) => !excludedFields.includes(field))
    .join(",");
  urlCopy.searchParams.set("fields", includedFields);
  return urlCopy;
}
