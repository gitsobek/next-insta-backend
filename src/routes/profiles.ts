import * as express from 'express';
import type { ContainerDependencies } from '../interfaces/container';

export const profilesRouting = ({
  profilesController,
  profilesValidation,
  apiKeyHandler,
  requireAccessHandler,
}: ContainerDependencies) => {
  const router = express.Router();

  router.get(
    '/:username',
    [apiKeyHandler, requireAccessHandler, profilesValidation.getProfileByUsername],
    profilesController.getProfileByUsername,
  );

  router.post(
    '/stories',
    [apiKeyHandler, requireAccessHandler, profilesValidation.addStory],
    profilesController.addStory,
  );

  router.get(
    '/stories/:username',
    [apiKeyHandler, requireAccessHandler, profilesValidation.getStories],
    profilesController.getStories,
  );

  router.delete(
    '/stories/:id',
    [apiKeyHandler, requireAccessHandler, profilesValidation.deleteStory],
    profilesController.deleteStory,
  );

  router.get(
    '/followers/:username',
    [apiKeyHandler, requireAccessHandler, profilesValidation.getFollowers],
    profilesController.getFollowers,
  );

  router.get(
    '/followingUsers/:username',
    [apiKeyHandler, requireAccessHandler, profilesValidation.getFollowingUsers],
    profilesController.getFollowingUsers,
  );

  router.post(
    '/follow/:username',
    [apiKeyHandler, requireAccessHandler, profilesValidation.followUser],
    profilesController.followUser,
  );

  router.delete(
    '/unfollow/:username',
    [apiKeyHandler, requireAccessHandler, profilesValidation.unfollowUser],
    profilesController.unfollowUser,
  );

  return router;
};
