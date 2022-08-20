import * as express from 'express';

export interface RoutingDependencies {
  usersRouting: express.Router;
  profilesRouting: express.Router;
}

export const createRouter = ({ usersRouting, profilesRouting }: RoutingDependencies): express.Router => {
  const router = express.Router();

  router.use('/users', usersRouting);
  router.use('/profiles', profilesRouting);

  return router;
};
