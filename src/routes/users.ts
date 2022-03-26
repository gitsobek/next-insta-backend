import * as express from "express";
import type { ControllerDependencies } from "../controllers";

export const usersRouting = ({ usersController }: ControllerDependencies) => {
  const router = express.Router();

  router.get('/', usersController.getUsers); 

  return router;
};
