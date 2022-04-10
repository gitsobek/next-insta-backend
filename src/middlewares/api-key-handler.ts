import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/unauthorized.error';
import type { CommonDependencies } from '../interfaces/app';

export const apiKeyHandler =
  ({ appConfig }: CommonDependencies) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers[appConfig.apiKeyHeaderName];

    if (apiKey !== appConfig.apiKey) {
      throw new UnauthorizedError('Invalid API key');
    }

    next();
  };
