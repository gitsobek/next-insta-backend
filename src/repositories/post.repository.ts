import type { Pagination } from '../interfaces/pagination';
import type { Post, PostLike } from '../interfaces/post';
import type { User } from '../interfaces/user';

export interface PostRepository {
  addPost: (userId: number, post: Post) => Promise<Post>;
  updatePost: (id: number, userId: number, post: Post) => Promise<number>;
  findPostById: (id: number) => Promise<Post | undefined>;
  getPosts: (id: number, queryObject?: Pagination) => Promise<[Post[], number]>;
  deletePost: (id: number, userId: number) => Promise<number>;
  getLikes: (id: number, queryObject?: Pagination) => Promise<[User[], number]>;
  likes: (visitorId: number, checkedPostId: number) => Promise<boolean>;
  like: (visitorId: number, postId: number) => Promise<PostLike>;
  unlike: (visitorId: number, postId: number) => Promise<number>;
}
