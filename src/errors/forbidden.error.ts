import { StatusCodes } from 'http-status-codes';
import { HttpError } from './http.error';

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}
