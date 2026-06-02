const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const routes = require('./routes');
const env = require('./config/env');
const requestLogger = require('./middlewares/requestLogger');
const requestTimer = require('./middlewares/requestTimer');
const { generalLimiter } = require('./middlewares/rateLimiters');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(compression());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestTimer);

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.use(requestLogger);
app.use(generalLimiter);
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
