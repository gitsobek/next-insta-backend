import * as express from 'express';
import type { ContainerDependencies } from '../interfaces/container';

export const commentsRouting = ({
  commentsController,
  commentsValidation,
  apiKeyHandler,
  requireAccessHandler,
}: ContainerDependencies) => {
  const router = express.Router();

  router.post(
    '/:postId',
    [apiKeyHandler, requireAccessHandler, commentsValidation.addComment],
    commentsController.addComment,
  );

  router.get(
    '/:postId',
    [apiKeyHandler, requireAccessHandler, commentsValidation.getComments],
    commentsController.getComments,
  );

  router.delete(
    '/:id',
    [apiKeyHandler, requireAccessHandler, commentsValidation.deleteComment],
    commentsController.deleteComment,
  );

  router.post(
    '/like/:id',
    [apiKeyHandler, requireAccessHandler, commentsValidation.likeComment],
    commentsController.likeComment,
  );

  router.delete(
    '/unlike/:id',
    [apiKeyHandler, requireAccessHandler, commentsValidation.unlikeComment],
    commentsController.unlikeComment,
  );

  return router;
};
