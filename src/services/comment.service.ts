import Messages from '../consts';
import { AppError } from '../errors/app.error';
import { NotFoundError } from '../errors/not-found.error';
import type { Comment, CommentPayload, CommentsResponse } from '../interfaces/comment';
import type { ContainerDependencies } from '../interfaces/container';
import type { Pagination } from '../interfaces/pagination';
import { handleAsync } from '../utils/handle-async';

export class CommentService {
  constructor(private dependencies: ContainerDependencies) {}

  async addComment(
    postId: number,
    userId: number,
    payload: CommentPayload,
  ): Promise<Comment> | never {
    const { postService, commentsRepository } = this.dependencies;

    await postService.getPost(postId, userId);

    const [commentResponse, errOnCreate] = await handleAsync(
      commentsRepository.addComment(postId, userId, payload),
    );

    if (errOnCreate) {
      throw new AppError(Messages.COMMENT.CREATE.APP_ERROR, errOnCreate);
    }

    return commentResponse!;
  }

  async getComments(
    postId: number,
    query: Pagination,
    userId: number,
  ): Promise<CommentsResponse> | never {
    const [commentResponse, errOnComments] = await handleAsync(
      this.dependencies.commentsRepository.getComments(postId, query, userId),
    );

    if (errOnComments) {
      throw new AppError(Messages.COMMENT.FIND_ALL.APP_ERROR, errOnComments);
    }

    const [comments = [], total = 0] = commentResponse!;

    return {
      comments,
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async deleteComment(id: number, userId: number): Promise<number> | never {
    const [deletedComment, errOnDelete] = await handleAsync(
      this.dependencies.commentsRepository.deleteComment(id, userId),
    );

    if (errOnDelete) {
      throw new AppError(Messages.COMMENT.DELETE.APP_ERROR, errOnDelete);
    }

    if (!deletedComment) {
      throw new NotFoundError(Messages.COMMENT.FIND_ONE.NOT_FOUND);
    }

    return deletedComment!;
  }

  async likeComment(commentId: number, authenticatedUserId: number): Promise<boolean> | never {
    const [comment, errOnFindComment] = await handleAsync(
      this.dependencies.commentsRepository.findCommentById(commentId),
    );

    if (errOnFindComment) {
      throw new AppError(Messages.COMMENT.FIND_ONE.APP_ERROR, errOnFindComment);
    }

    if (!comment) {
      throw new NotFoundError(Messages.COMMENT.FIND_ONE.NOT_FOUND);
    }

    const [result, errOnLikeComment] = await handleAsync(
      this.dependencies.commentsRepository.like(commentId, authenticatedUserId),
    );

    if (errOnLikeComment) {
      throw new AppError(Messages.COMMENT.LIKE.APP_ERROR, errOnLikeComment);
    }

    return !!result;
  }

  async unlikeComment(commentId: number, authenticatedUserId: number): Promise<boolean> | never {
    const [comment, errOnFindComment] = await handleAsync(
      this.dependencies.commentsRepository.findCommentById(commentId),
    );

    if (errOnFindComment) {
      throw new AppError(Messages.COMMENT.FIND_ONE.APP_ERROR, errOnFindComment);
    }

    if (!comment) {
      throw new NotFoundError(Messages.COMMENT.FIND_ONE.NOT_FOUND);
    }

    const [result, errOnLikeComment] = await handleAsync(
      this.dependencies.commentsRepository.unlike(commentId, authenticatedUserId),
    );

    if (errOnLikeComment) {
      throw new AppError(Messages.COMMENT.LIKE.APP_ERROR, errOnLikeComment);
    }

    return !!result;
  }
}
