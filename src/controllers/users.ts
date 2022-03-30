import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { Controller } from '../interfaces/app';
import type { UserRepository } from '../repositories/user.repository';
import type { ServiceDependencies } from '../services';

export const createUsersController = ({ userService }: ServiceDependencies): Controller<UserRepository> => {
  const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getUsers();

    return res.status(200).send({
      code: StatusCodes.OK,
      message: 'All users have been successfully fetched.',
      data: users,
    });
  };

  return { getUsers };
};
