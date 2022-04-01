import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { Controller } from '../interfaces/app';
import type { ServiceDependencies, UserService } from '../services';

export const createUsersController = ({ userService }: ServiceDependencies): Controller<UserService> => {
  const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { order = { by: 'username', type: 'asc' }, page = 1, limit = 10 } = req.query as any;

    const queryObject = {
      page: +page,
      limit: +limit,
      order,
    };

    const { users, total: count } = await userService.getUsers(queryObject);

    return res.status(200).send({
      code: StatusCodes.OK,
      message: 'All users have been successfully fetched.',
      data: users,
      count,
    });
  };

  return { getUsers };
};
