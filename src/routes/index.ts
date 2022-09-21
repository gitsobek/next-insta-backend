import * as express from 'express';

export interface RoutingDependencies {
  usersRouting: express.Router;
  profilesRouting: express.Router;
  postsRouting: express.Router;
  commentsRouting: express.Router;
}

export const createRouter = ({
  usersRouting,
  profilesRouting,
  postsRouting,
  commentsRouting,
}: RoutingDependencies): express.Router => {
  const router = express.Router();

  router.use('/users', usersRouting);
  router.use('/profiles', profilesRouting);
  router.use('/posts', postsRouting);
  router.use('/comments', commentsRouting);

  return router;
};

export * from './users';
export * from './posts';
export * from './comments';
export * from './profiles';
