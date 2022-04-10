import { UnauthorizedError } from '../errors/unauthorized.error';

export class BearerToken {
  static fromCookieOrString(token: string): BearerToken | never {
    if (!token) {
      throw new UnauthorizedError('Access token is missing or invalid.');
    }

    return new BearerToken(token);
  }

  static fromHeader(token: string) {
    const regex = /^(Bearer) ([^\s]+)$/;

    if (!token || !regex.test(token)) {
      throw new UnauthorizedError('Access token is missing or invalid.');
    }

    const match = token.match(regex);

    if (match && match.length === 3) {
      return new BearerToken(match[2]);
    }

    throw new UnauthorizedError('Access token is missing or invalid.');
  }

  constructor(private accessToken: string) {}

  get token(): string {
    return this.accessToken;
  }
}
