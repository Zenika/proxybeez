/**
 *
 * @template T, R
 * @param {Iterable<T>} arr
 * @param {(t: T) => Promise<R> | R} fn
 * @returns {Promise<Array<R>>}
 */
export default async function asyncMap(arr, fn) {
  const results = [];
  for (const element of arr) {
    results.push(await fn(element));
  }
  return results;
}
