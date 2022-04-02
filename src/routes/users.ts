import * as express from 'express';
import type { ContainerDependencies } from '../interfaces/container';

export const usersRouting = ({ usersController, usersValidation }: ContainerDependencies) => {
  const router = express.Router();

  router.get('/', usersValidation.getUsers, usersController.getUsers);
  router.get('/getById/:userId', usersValidation.getUserById, usersController.getUserById);
  router.get('/getByUsername/:username', usersValidation.getUserByUsername, usersController.getUserByUsername);
  router.post('/', usersValidation.createUser, usersController.createUser);
  router.patch('/:userId', usersValidation.updateUser, usersController.updateUser);
  router.delete('/:userId', usersValidation.deleteUser, usersController.deleteUser);

  return router;
};
