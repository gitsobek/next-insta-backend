import type { Request, Response, NextFunction } from 'express';
import type { Controller } from '../interfaces/app';
import type { ServiceDependencies, UserRepository } from '../services';

export const createUsersController = ({ userService }: ServiceDependencies): Controller<UserRepository> => {
  const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getUsers();

    return res.status(200).send({
      message: 'All users have been successfully fetched.',
      data: users,
    });
  };

  return { getUsers };
};
