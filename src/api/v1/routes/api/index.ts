import express from "express";
import { exchangeRatesRouter } from "./exchangeRates";
const apiRouter = express.Router();

apiRouter.use("/exchangeRates", exchangeRatesRouter);

export { apiRouter };
