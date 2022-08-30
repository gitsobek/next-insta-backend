import type { PaginationResponse } from './pagination';

export interface Post {
  id: number;
  photoUrl: string;
  description?: string;
  location?: string;
  likes?: number;
  userId: number;
}

export interface PostLike {
  postId: number;
  userId: number;
}

export interface PostsResponse extends PaginationResponse {
  posts: Post[];
}
