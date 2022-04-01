import * as express from "express";
import type { ContainerDependencies } from "../interfaces/container";

export const usersRouting = ({ usersController, usersValidation }: ContainerDependencies) => {
  const router = express.Router();

  router.get('/', usersValidation.getUsers, usersController.getUsers); 

  return router;
};
