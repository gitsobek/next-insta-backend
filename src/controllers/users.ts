import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { Controller } from '../interfaces/app';
import type { ServiceDependencies, UserService } from '../services';

export const createUsersController = ({ userService }: ServiceDependencies): Controller<UserService> => {
  const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = await userService.getUserById(+req.params.userId);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'User has been successfully fetched.',
      data: user,
    });
  };

  const getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = await userService.getUserByUsername(req.params.username);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'User has been successfully fetched.',
      data: user,
    });
  };

  const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { order = { by: 'username', type: 'asc' }, page = 1, limit = 10 } = req.query as any;

    const queryObject = {
      page: +page,
      limit: +limit,
      order,
    };

    const { users, total: count } = await userService.getUsers(queryObject);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'All users have been successfully fetched.',
      data: users,
      count,
    });
  };

  const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    const { user } = await userService.createUser({ username, email, password });

    return res.status(StatusCodes.CREATED).send({
      code: StatusCodes.CREATED,
      message: 'User has been created successfully.',
      data: user,
    });
  };

  const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = await userService.updateUser(+req.params.userId, req.body);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'User has been updated successfully.',
      data: user,
    });
  };

  const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    await userService.deleteUser(+req.params.userId);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'User has been deleted successfully.',
    });
  };

  return { getUserById, getUserByUsername, getUsers, createUser, updateUser, deleteUser };
};
