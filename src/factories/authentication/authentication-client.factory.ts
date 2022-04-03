import { AuthenticationStrategy } from './authentication-client.types';
import { CustomAuthenticationClient } from './custom_jwt_v1/custom-authentication-client';

export class AuthenticationClientFactory {
  public getAuthenticationClient(type: AuthenticationStrategy) {
    switch (type) {
      case AuthenticationStrategy.CUSTOM_JWT_V1:
        return CustomAuthenticationClient;
      default:
        throw new Error(`Authentication strategy ${type} not supported. Cannot start the service.`);
    }
  }
}
