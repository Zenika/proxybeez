/**
 *
 * @param {URL | string} url
 * @param {string} key
 * @returns {URL}
 */
export function insertKey(url, key) {
  const urlCopy = new URL(url.toString());
  urlCopy.searchParams.set("key", key);
  return urlCopy;
}
