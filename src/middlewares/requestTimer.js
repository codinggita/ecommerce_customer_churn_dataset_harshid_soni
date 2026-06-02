const requestTimer = (req, res, next) => {
  const startedAt = process.hrtime.bigint();
  res.setHeader('X-Request-Started-At', new Date().toISOString());

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    req.requestTimeMs = Number(durationMs.toFixed(2));
  });

  next();
};

module.exports = requestTimer;
