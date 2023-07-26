import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import type { Application } from 'express';
import express from 'express';
import mongoose from 'mongoose';

import { errorHandler } from './api/v1/middlewares/errorHandler';
import { router } from './api/v1/routes';
import { config } from './config/defaultConfig';
import { job } from './utils/updateExchangeRates';

const app: Application = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', router);

app.use(errorHandler);

mongoose.connect(config.MONGODB_URL);

app.listen(config.PORT, () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  job;
  console.log(
    `App listening on http://${config.HOST}:${config.PORT}, env=${config.NODE_ENV}`,
  );
});

export default app;
