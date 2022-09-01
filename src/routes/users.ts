import * as express from 'express';
import type { ContainerDependencies } from '../interfaces/container';

export const usersRouting = ({
  usersController,
  usersValidation,
  apiKeyHandler,
  requireAccessHandler,
  featureDisabledHandler
}: ContainerDependencies) => {
  const router = express.Router();

  /* Auth-based endpoints */
  router.post('/login', [apiKeyHandler, usersValidation.login], usersController.login);
  router.post('/register', [apiKeyHandler, usersValidation.createUser], usersController.createUser);
  router.get('/me', [apiKeyHandler, requireAccessHandler], usersController.checkIfAuthenticated);
  router.post(
    '/refreshToken',
    [apiKeyHandler, usersValidation.refreshToken],
    usersController.refreshToken,
  );
  router.post(
    '/requestPasswordReset',
    [apiKeyHandler, usersValidation.requestPasswordReset],
    usersController.requestPasswordReset,
  );
  router.patch(
    '/resetPassword',
    [apiKeyHandler, usersValidation.resetPassword],
    usersController.resetPassword,
  );
  router.patch(
    '/changePassword',
    [apiKeyHandler, requireAccessHandler, usersValidation.changePassword],
    usersController.changePassword,
  );
  router.post('/logout', [apiKeyHandler, requireAccessHandler], usersController.logout);

  /* User resource endpoints */
  router.get(
    '/',
    [apiKeyHandler, featureDisabledHandler, usersValidation.getUsers],
    usersController.getUsers,
  );
  router.get(
    '/getById/:userId',
    [apiKeyHandler, featureDisabledHandler, usersValidation.getUserById],
    usersController.getUserById,
  );
  router.get(
    '/getByUsername/:username',
    [apiKeyHandler, featureDisabledHandler, usersValidation.getUserByUsername],
    usersController.getUserByUsername,
  );
  router.patch(
    '/',
    [apiKeyHandler, requireAccessHandler, usersValidation.updateUser],
    usersController.updateUser,
  );
  router.delete('/', [apiKeyHandler, requireAccessHandler], usersController.deleteUser);

  return router;
};
