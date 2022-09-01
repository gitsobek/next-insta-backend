import type { Pagination } from '../interfaces/pagination';
import type { Post, PostLike } from '../interfaces/post';
import type { User } from '../interfaces/user';

export interface PostRepository {
  addPost: (userId: number, post: Post) => Promise<Post>;
  updatePost: (id: number, userId: number, post: Post) => Promise<number>;
  findPostById: (id: number, userId?: number) => Promise<Post | undefined>;
  getPosts: (id: number, queryObject?: Pagination, userId?: number) => Promise<[Post[], number]>;
  deletePost: (id: number, userId: number) => Promise<number>;
  getLikes: (id: number, queryObject?: Pagination) => Promise<[User[], number]>;
  likes: (postId: number, visitorId: number) => Promise<boolean>;
  like: (postId: number, visitorId: number) => Promise<PostLike>;
  unlike: (postId: number, visitorId: number) => Promise<number>;
}
