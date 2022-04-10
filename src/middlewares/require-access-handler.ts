import type { Request, Response, NextFunction } from 'express';
import type { ServiceDependencies } from '../services';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { BearerToken } from '../utils/bearer-token';
import { handleAsync } from '../utils/handle-async';
import { HttpErrorType } from '../errors/http.error';

export const requireAccessHandler =
  ({ authService }: ServiceDependencies) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> | never => {
    try {
      const { authorization = '' } = req.headers;
      const { 'X-SECURITY-TOKEN': cookieToken = '' } = req.cookies || {};

      const accessToken = authorization
        ? BearerToken.fromHeader(authorization).token
        : BearerToken.fromCookieOrString(cookieToken).token;

      const [authUser, errOnVerification] = await handleAsync(authService.isAuthenticated(accessToken));

      if (errOnVerification) {
        throw new UnauthorizedError(
          'Invalid access token',
          errOnVerification.name === 'TokenExpiredError'
            ? HttpErrorType.TOKEN_EXPIRED
            : HttpErrorType.INVALID_OR_MISSING,
        );
      }

      if (!authUser) {
        throw new UnauthorizedError('User is not authenticated');
      }

      res.locals.accessToken = accessToken;
      res.locals.user = authUser;
      next();
    } catch (e) {
      next(e);
    }
  };
