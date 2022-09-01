import type { Comment, CommentLike, CommentPayload } from '../interfaces/comment';
import type { Pagination } from '../interfaces/pagination';

export interface CommentRepository {
  addComment: (postId: number, userId: number, commentPayload: CommentPayload) => Promise<Comment>;
  findCommentById: (id: number) => Promise<Comment | undefined>;
  getComments: (
    postId: number,
    queryObject?: Pagination,
    userId?: number,
  ) => Promise<[Comment[], number]>;
  deleteComment: (id: number, userId: number) => Promise<number>;
  likes: (commentId: number, visitorId: number) => Promise<boolean>;
  like: (commentId: number, visitorId: number) => Promise<CommentLike>;
  unlike: (commentId: number, visitorId: number) => Promise<number>;
}
