const cache = new Map();

const cacheMiddleware = (ttlSeconds = 30) => (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl;
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(cached.statusCode).json(cached.body);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, {
      statusCode: res.statusCode,
      body,
      expiresAt: now + ttlSeconds * 1000,
    });
    res.setHeader('X-Cache', 'MISS');
    return originalJson(body);
  };

  return next();
};

const clearCache = () => {
  cache.clear();
};

module.exports = {
  cacheMiddleware,
  clearCache,
};
