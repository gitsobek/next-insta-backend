import { Logger } from '../../tools/logger';
import { Server } from 'http';
import { Application } from './application.types';

export interface HttpApplicationProps {
  server: Server;
  port: number;
  logger: Logger;
}

export class HttpApplication implements Application {
  constructor(private dependencies: HttpApplicationProps) {}

  public async start(): Promise<void> {
    const { server, port, logger } = this.dependencies;
    server.listen(port, () => logger.info(`Server is up & running. Listening on port: ${port}`));
  }
}
