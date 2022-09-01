import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { TokenPayload } from '../factories/authentication/authentication-client.types';
import { type Pagination, Sorting } from '../interfaces/pagination';
import type { ServiceDependencies } from '../services';

export type CommentHandlers = keyof ReturnType<typeof createCommentsController>;

export const createCommentsController = ({ commentService }: ServiceDependencies) => {
  const addComment = async (req: Request, res: Response, next: NextFunction) => {
    await commentService.addComment(
      +req.params.postId,
      (res.locals.user as TokenPayload).userId,
      req.body,
    );

    return res.status(StatusCodes.CREATED).send({
      code: StatusCodes.CREATED,
      message: 'Comment has been successfully added.',
    });
  };

  const getComments = async (req: Request, res: Response, next: NextFunction) => {
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

    const comments = await commentService.getComments(
      +req.params.postId,
      queryObject,
      (res.locals.user as TokenPayload).userId,
    );

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Comments have been successfully fetched.',
      data: comments,
    });
  };

  const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    await commentService.deleteComment(+req.params.id, (res.locals.user as TokenPayload).userId);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Comment has been successfully deleted.',
    });
  };

  const likeComment = async (req: Request, res: Response, next: NextFunction) => {
    await commentService.likeComment(+req.params.id, (res.locals.user as TokenPayload).userId);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Comment has been successfully liked.',
    });
  };

  const unlikeComment = async (req: Request, res: Response, next: NextFunction) => {
    await commentService.unlikeComment(+req.params.id, (res.locals.user as TokenPayload).userId);

    return res.status(StatusCodes.OK).send({
      code: StatusCodes.OK,
      message: 'Comment has been successfully unliked.',
    });
  };

  return {
    addComment,
    getComments,
    deleteComment,
    likeComment,
    unlikeComment,
  };
};
