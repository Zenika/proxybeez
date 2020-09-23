/**
 *
 * @param {string | URL} url
 * @param {string} key
 * @returns {URL}
 */
export function insertKey(url, key) {
  const urlCopy = new URL(url.toString());
  urlCopy.searchParams.set("key", key);
  return urlCopy;
}

/**
 *
 * @param {string | URL} url
 * @param {string[]} excludedFields
 * @returns {URL}
 */
export function excludeFields(url, excludedFields) {
  const urlCopy = new URL(url.toString());
  const fields = urlCopy.searchParams.get("fields");
  const includedFields = fields
    .split(",")
    .filter((field) => !excludedFields.includes(field))
    .join(",");
  urlCopy.searchParams.set("fields", includedFields);
  return urlCopy;
}
