import * as express from 'express';

export interface RoutingDependencies {
  usersRouting: express.Router;
}

export const createRouter = ({ usersRouting }: RoutingDependencies): express.Router => {
  const router = express.Router();

  router.use('/users', usersRouting);

  return router;
};
