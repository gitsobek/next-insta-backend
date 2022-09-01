import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { TokenPayload } from '../factories/authentication/authentication-client.types';
import { type Pagination, Sorting } from '../interfaces/pagination';
import type { ServiceDependencies } from '../services';

export type PostHandlers = keyof ReturnType<typeof createPostsController>;

export const createPostsController = ({ postService }: ServiceDependencies) => {
  const addPost = async (req: Request, res: Response, next: NextFunction) => {
    await postService.addPost((res.locals.user as TokenPayload).userId, req.body);

    return res.status(StatusCodes.CREATED).send({
      code: StatusCodes.CREATED,
      message: 'Post has been successfully added.',
    });
  };

  const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    await postService.updatePost(
      +req.params.id,
      (res.locals.user as TokenPayload).userId,
      req.body,
    );

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Post has been successfully updated.',
    });
  };

  const getPost = async (req: Request, res: Response, next: NextFunction) => {
    const post = await postService.getPost(+req.params.id);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Post has been successfully fetched.',
      data: post,
    });
  };

  const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const {
      order = { by: 'createdAt', type: Sorting.DESCENDING },
      page = 1,
      limit = 10,
      filter,
    } = req.query as unknown as Pagination;

    const queryObject: Pagination = {
      page: +page,
      limit: +limit,
      order,
      filter,
    };

    const posts = await postService.getPosts(req.params.username, queryObject);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Posts have been successfully fetched.',
      data: posts,
    });
  };

  const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const posts = await postService.deletePost(
      +req.params.id,
      (res.locals.user as TokenPayload).userId,
    );

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Post has been successfully deleted.',
      data: posts,
    });
  };

  const getLikes = async (req: Request, res: Response, next: NextFunction) => {
    const {
      order = { by: 'username', type: Sorting.ASCENDING },
      page = 1,
      limit = 10,
      filter,
    } = req.query as unknown as Pagination;

    const queryObject: Pagination = {
      page: +page,
      limit: +limit,
      order,
      filter,
    };

    const likes = await postService.getLikes(+req.params.id, queryObject);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Likes have been successfully fetched.',
      data: likes,
    });
  };

  const likePost = async (req: Request, res: Response, next: NextFunction) => {
    await postService.likePost(+req.params.id, (res.locals.user as TokenPayload).userId);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Post has been successfully liked.',
    });
  };

  const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
    await postService.unlikePost(+req.params.id, (res.locals.user as TokenPayload).userId);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Post has been successfully unliked.',
    });
  };

  return {
    addPost,
    updatePost,
    getPost,
    getPosts,
    deletePost,
    getLikes,
    likePost,
    unlikePost,
  };
};
