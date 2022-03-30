import { createServer } from '../../app';
import { ApplicationType } from '../../interfaces/app';

export class ApplicationFactory {
  public getApplicationBuilder(type: ApplicationType) {
    if (type === ApplicationType.HTTP) {
      return createServer;
    }

    throw new Error(`Application type ${type} not supported. Cannot start the service.`);
  }
}
