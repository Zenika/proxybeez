export function insertKey(url, key) {
  const urlCopy = new URL(url);
  urlCopy.searchParams.set("key", key);
  return urlCopy;
}

export function excludeFields(url, excludedFields) {
  const urlCopy = new URL(url);
  const fields = urlCopy.searchParams.get("fields");
  const includedFields = fields
    .split(",")
    .filter((field) => !excludedFields.includes(field))
    .join(",");
  urlCopy.searchParams.set("fields", includedFields);
  return urlCopy;
}
