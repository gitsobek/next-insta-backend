import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { TokenPayload } from '../factories/authentication/authentication-client.types';
import { type Pagination, Sorting } from '../interfaces/pagination';
import type { ServiceDependencies } from '../services';

export type ProfileHandlers = keyof ReturnType<typeof createProfilesController>;

export const createProfilesController = ({ profileService }: ServiceDependencies) => {
  const getProfileByUsername = async (req: Request, res: Response, next: NextFunction) => {
    const profile = await profileService.getProfileByUsername(
      req.params.username,
      (res.locals.user as TokenPayload).userId,
    );

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Profile has been successfully fetched.',
      data: profile,
    });
  };

  const getFollowers = async (req: Request, res: Response, next: NextFunction) => {
    const {
      order = { by: 'username', type: Sorting.ASCENDING },
      page = 1,
      limit = 10,
      filter
    } = req.query as unknown as Pagination;

    const queryObject: Pagination = {
      page: +page,
      limit: +limit,
      order,
      filter
    };
    
    const followers = await profileService.getFollowers(
      req.params.username,
      queryObject
    );

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Followers have been successfully fetched.',
      data: followers,
    });
  };

  const getFollowingUsers = async (req: Request, res: Response, next: NextFunction) => {
    const {
      order = { by: 'username', type: Sorting.ASCENDING },
      page = 1,
      limit = 10,
      filter
    } = req.query as unknown as Pagination;

    const queryObject: Pagination = {
      page: +page,
      limit: +limit,
      order,
      filter
    };
    
    const followers = await profileService.getFollowingUsers(
      req.params.username,
      queryObject
    );

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Following users have been successfully fetched.',
      data: followers,
    });
  };

  const followUser = async (req: Request, res: Response, next: NextFunction) => {
     await profileService.followUser(
      req.params.username,
      (res.locals.user as TokenPayload).userId,
    );

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'User has been successfully followed.',
    });
  };

  const unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
    await profileService.unfollowUser(
     req.params.username,
     (res.locals.user as TokenPayload).userId,
   );

   return res.status(StatusCodes.OK).send({
     code: StatusCodes.OK,
     message: 'User has been successfully unfollowed.',
   });
 };

  return {
    getProfileByUsername,
    getFollowers,
    getFollowingUsers,
    followUser,
    unfollowUser
  };
};
