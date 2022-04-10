import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { ServiceDependencies } from '../services';
import { BearerToken } from '../utils/bearer-token';

export type UserHandlers = keyof ReturnType<typeof createUsersController>;

export const createUsersController = ({ userService, authService }: ServiceDependencies) => {
  const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const tokenObject = await authService.login(username, password);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'User has logged in successfully.',
      data: tokenObject,
    });
  };

  const checkIfAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = res.locals;
    const decodedToken = await authService.getTokenInfo(accessToken);
    const { user } = await userService.getUserById(decodedToken.userId);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      data: user,
    });
  };

  const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization = '' } = req.headers;
    const { 'X-SECURITY-TOKEN': cookieToken = '' } = req.cookies || {};

    const accessToken = authorization
      ? BearerToken.fromHeader(authorization).token
      : BearerToken.fromCookieOrString(cookieToken).token;

    const { accessToken: accessTokenFromBody, refreshToken } = req.body;
    const tokens = await authService.refreshToken(accessToken || accessTokenFromBody, refreshToken);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      data: tokens,
    });
  };

  const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    await authService.requestPasswordReset(username);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Password reset request has been completed.',
    });
  };

  const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken, newPassword } = req.body;

    const { user } = await userService.getUserByProps({ resetPasswordToken: resetToken });
    await authService.resetPassword(user.username, newPassword);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Password has been successfully updated.',
    });
  };

  const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;
    const { oldPassword, newPassword } = req.body;

    await authService.setNewPassword(user.username, oldPassword, newPassword);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Password has been successfully updated.',
    });
  };

  const logout = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    await authService.logout(user.username);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'User has been successfully logged out.',
    });
  };

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

  return {
    login,
    checkIfAuthenticated,
    refreshToken,
    requestPasswordReset,
    resetPassword,
    changePassword,
    getUserById,
    getUserByUsername,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    logout,
  };
};
