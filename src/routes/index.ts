import * as express from 'express';

export interface RoutingDependencies {
  usersRouting: express.Router;
  profilesRouting: express.Router;
  postsRouting: express.Router;
}

export const createRouter = ({ usersRouting, profilesRouting, postsRouting }: RoutingDependencies): express.Router => {
  const router = express.Router();

  router.use('/users', usersRouting);
  router.use('/profiles', profilesRouting);
  router.use('/posts', postsRouting);

  return router;
};

export * from './users';
export * from './posts';
export * from './profiles';