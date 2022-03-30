import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import { NotFoundError } from './errors/not-found.error';
import { Model } from 'objection';
import swaggerExpressOptions from './tools/swagger';
import type { ContainerDependencies } from './interfaces/container';
import { HttpApplication } from './factories/application/http-application';

const createApp = ({ router, errorHandler, logger, db }: ContainerDependencies): express.Express => {
  const app = express();

  Model.knex(db);

  const stream: morgan.StreamOptions = {
    write: (message) => logger.http(message),
  };

  app.use(morgan('combined', { stream }));
  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'", "https: 'unsafe-inline'"],
        },
      },
    }),
  );
  app.use(
    compression({
      filter: (req: express.Request, res: express.Response) => {
        if (req.headers['x-no-compression']) {
          return false;
        }

        return compression.filter(req, res);
      },
    }),
  );
  app.use(express.json());

  app.get('/health', (_, res) => {
    res.status(200).json({
      status: 'OK',
    });
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerExpressOptions)));
  app.use('/v1', router);

  app.use('*', (req, res, next) => next(new NotFoundError('Endpoint not found')));
  app.use(errorHandler);

  return app;
}

const createServer = ({ port, app, logger }: ContainerDependencies): HttpApplication => {
  const server = http.createServer(app);
  return new HttpApplication({ server, port, logger });
};

export { createApp, createServer };
