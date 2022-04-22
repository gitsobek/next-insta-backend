import { StatusCodes } from 'http-status-codes';
import { HttpError, HttpErrorType } from './http.error';

export class UnauthorizedError extends HttpError {
  constructor(message: string, readonly type: HttpErrorType = HttpErrorType.INVALID_OR_MISSING) {
    super(message, StatusCodes.UNAUTHORIZED, type);
  }
}
