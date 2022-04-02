export class AppError extends Error {
  constructor(message: string, readonly details?: Error) {
    super(message);

    Error.captureStackTrace(this, AppError.captureStackTrace);
  }
}
