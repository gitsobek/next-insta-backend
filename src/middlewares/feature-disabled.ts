import type { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/http.error';

export const featureDisabledHandler =
  () =>
  (req: Request, res: Response, next: NextFunction): void => {
    return next(new HttpError(ReasonPhrases.METHOD_NOT_ALLOWED, StatusCodes.METHOD_NOT_ALLOWED));
  };
