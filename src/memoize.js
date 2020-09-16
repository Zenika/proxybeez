const CACHE_TTL = Number(process.env.CACHE_TTL || 60 * 60 * 1000);

const cache = new Map();

export const memoize = (func) => {
  return async (args) => {
    const now = Date.now();
    const key = JSON.stringify(args);
    if (!cache.get(key)) {
      cache.set(key, { result: await func(args), date: now });
      setTimeout(() => {
        cache.delete(key)
      }, CACHE_TTL + 1000);
      return cache.get(key).result;
    }
    if (now - cache.get(key).date >= CACHE_TTL) {
      func(args).then((result) => cache.set(key, { result, date: now }));
      return cache.get(key).result;
    }
    return cache.get(key).result;
  };
};
