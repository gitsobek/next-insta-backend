import * as express from 'express';
import type { ContainerDependencies } from '../interfaces/container';

export const postsRouting = ({
  postsController,
  postsValidation,
  apiKeyHandler,
  requireAccessHandler,
}: ContainerDependencies) => {
  const router = express.Router();

  router.post(
    '/',
    [apiKeyHandler, requireAccessHandler, postsValidation.addPost],
    postsController.addPost,
  );

  router.get(
    '/getById/:id',
    [apiKeyHandler, requireAccessHandler, postsValidation.getPost],
    postsController.getPost,
  );

  router.get(
    '/:username',
    [apiKeyHandler, requireAccessHandler, postsValidation.getPosts],
    postsController.getPosts,
  );

  router.delete(
    '/:id',
    [apiKeyHandler, requireAccessHandler, postsValidation.deletePost],
    postsController.deletePost,
  );

  router.get(
    '/likes/:id',
    [apiKeyHandler, requireAccessHandler, postsValidation.getLikes],
    postsController.getLikes,
  );

  router.post(
    '/like/:id',
    [apiKeyHandler, requireAccessHandler, postsValidation.likePost],
    postsController.likePost,
  );

  router.delete(
    '/unlike/:id',
    [apiKeyHandler, requireAccessHandler, postsValidation.unlikePost],
    postsController.unlikePost,
  );

  return router;
};
