import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import { NotFoundError } from './errors/not-found.error';
import { Model } from 'objection';
import swaggerExpressOptions from './tools/swagger';
import { ContainerDependencies } from './models/container';

async function createApp({ router, errorHandler, logger, db }: ContainerDependencies): Promise<express.Express> {
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
  app.use(helmet.contentSecurityPolicy());
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

export { createApp };
