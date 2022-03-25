import * as express from "express";
import { getAll } from "../controllers/users";

export const usersRouting = () => {
  const router = express.Router();

  router.get('/', getAll); 

  return router;
};
