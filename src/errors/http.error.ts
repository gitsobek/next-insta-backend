import { AppError } from './app.error';

export enum HttpErrorType {
  INVALID_OR_MISSING = 'INVALID_OR_MISSING',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
}

export class HttpError extends AppError {
  constructor(message: string, readonly status: number, readonly type?: HttpErrorType) {
    super(message);
  }
}
