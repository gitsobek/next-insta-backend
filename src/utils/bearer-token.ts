import { UnauthorizedError } from '../errors/unauthorized.error';
import Messages from '../consts';

export class BearerToken {
  static fromCookieOrString(token: string): BearerToken | never {
    if (!token) {
      throw new UnauthorizedError(Messages.TOKENS.VERIFY.MISSING_ACCESS_TOKEN);
    }

    return new BearerToken(token);
  }

  static fromHeader(token: string) {
    const regex = /^(Bearer) ([^\s]+)$/;

    if (!token || !regex.test(token)) {
      throw new UnauthorizedError(Messages.TOKENS.VERIFY.MISSING_ACCESS_TOKEN);
    }

    const match = token.match(regex);

    if (match && match.length === 3) {
      return new BearerToken(match[2]);
    }

    throw new UnauthorizedError(Messages.TOKENS.VERIFY.MISSING_ACCESS_TOKEN);
  }

  constructor(private accessToken: string) {}

  get token(): string {
    return this.accessToken;
  }
}
