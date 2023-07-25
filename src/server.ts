import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { router } from "./api/v1/routes";
import { errorHandler } from "./api/v1/middlewares/errorHandler";
import { config } from "./config/defaultConfig";

import mongoose from "mongoose";
import { job } from "./utils/updateExchangeRates";

const app: Application = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/", router);

app.use(errorHandler);

mongoose.connect(config.MONGODB_URL);

app.listen(config.PORT, () => {
  job;
  console.log(
    `App listening on http://${config.HOST}:${config.PORT}, env=${config.NODE_ENV}`
  );
});

export default app;
