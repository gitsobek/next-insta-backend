import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error';
import { HttpError } from '../errors/http.error';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../tools/logger';
import { CelebrateError, isCelebrateError } from 'celebrate';

export const humanizeErrorMessage = (error: CelebrateError): Record<string, string[]> =>
  Object.entries(Object.fromEntries(error.details)).reduce(
    (dir: Record<string, string[]>, [k, v]) => ((dir[k] ||= []).push(...v.details.map(({ message }) => message)), dir),
    {},
  );

export const errorHandler =
  ({ logger, hideDetailsFromProduction }: { logger: Logger; hideDetailsFromProduction: Function }) =>
  (err: Error, req: Request, res: Response, _next: NextFunction): Response => {
    if (isCelebrateError(err)) {
      try {
        return res.status(StatusCodes.BAD_REQUEST).json({
          code: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          error: humanizeErrorMessage(err),
          stack: hideDetailsFromProduction(err.stack),
        });
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: 'An error has occurred while validating request.',
          stack: hideDetailsFromProduction(err.stack),
        });
      }
    }

    logger.error(err.toString());

    if (err instanceof HttpError) {
      return res.status(err.status).json({
        code: err.status,
        error: err.message,
        stack: hideDetailsFromProduction(err.stack),
      });
    }

    if (err instanceof AppError) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        error: err?.message || 'Internal server error.',
        stack: hideDetailsFromProduction(err.stack),
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: 'Internal server error.',
      stack: hideDetailsFromProduction(err.stack),
    });
  };
