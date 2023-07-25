import type { Request, Response } from 'express';
import express from 'express';
import asyncH from 'express-async-handler';

import { ExchangeRates } from '../../models/ExchangeRates';

const exchangeRatesRouter = express.Router();

exchangeRatesRouter.get(
  '/:date',
  asyncH(async (req: Request, res: Response, _next: any) => {
    const { date } = req.params;
    const document = await ExchangeRates.findOne({ date });
    if (document) {
      res.status(200).json(document);
      return;
    }
    res.status(500).send();
  }),
);

export { exchangeRatesRouter };
