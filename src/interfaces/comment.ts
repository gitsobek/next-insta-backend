import type { PaginationResponse } from './pagination';

export interface Comment {
  id: number;
  text: string;
  likes?: number;
  postId: number;
  userId: number;
}

export interface CommentLike {
  commentId: number;
  userId: number;
}

export interface CommentsResponse extends PaginationResponse {
  comments: Comment[];
}

export interface CommentPayload {
  text: string;
}
