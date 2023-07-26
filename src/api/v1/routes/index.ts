import type { Request, Response } from 'express';
import express from 'express';

import { apiRouter } from './api';

const router = express.Router();

router.get('/', (_req: Request, res: Response, _next: any) => {
  res.status(200).send('it works');
});

router.use('/api', apiRouter);

export { router };
