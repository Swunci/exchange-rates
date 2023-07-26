import type { Request, Response } from 'express';

import {
  BadRequestError,
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/ResponseErrors';

const errorHandler = (err: Error, req: Request, res: Response) => {
  switch (err.name) {
    case DatabaseError.name:
      res.status(DatabaseError.statusCode).json({
        responseMessage: err.message,
      });
      break;
    case ForbiddenError.name:
      res.status(ForbiddenError.statusCode).json({
        responseMessage: err.message,
      });
      break;
    case NotFoundError.name:
      res.status(NotFoundError.statusCode).json({
        responseMessage: err.message,
      });
      break;

    case UnauthorizedError.name:
      res.status(UnauthorizedError.statusCode).json({
        responseMessage: err.message,
      });
      break;
    case BadRequestError.name:
      res.status(BadRequestError.statusCode).json({
        responseMessage: err.message,
      });
      break;
    case ConflictError.name:
      res.status(ConflictError.statusCode).json({
        responseMessage: err.message,
      });
      break;
    default:
      console.log(err.message);
      res.status(500).json({
        responseMessage: 'Unhandled Error',
      });
  }
};

export { errorHandler };
