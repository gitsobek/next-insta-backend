import Messages from '../consts';
import { AppError } from '../errors/app.error';
import { NotFoundError } from '../errors/not-found.error';
import type { ContainerDependencies } from '../interfaces/container';
import { Pagination, Sorting } from '../interfaces/pagination';
import type { Post, PostsResponse } from '../interfaces/post';
import { UsersResponse } from '../interfaces/user';
import { createUserForPublic } from '../models/user';
import { handleAsync } from '../utils/handle-async';

export class PostService {
  constructor(private dependencies: ContainerDependencies) {}

  async addPost(userId: number, post: Post): Promise<Post> | never {
    const [postResponse, errOnCreate] = await handleAsync(
      this.dependencies.postsRepository.addPost(userId, post),
    );

    if (errOnCreate) {
      throw new AppError(Messages.POST.CREATE.APP_ERROR, errOnCreate);
    }

    return postResponse!;
  }

  async getPost(id: number): Promise<Post> | never {
    const [post, errOnPost] = await handleAsync(this.dependencies.postsRepository.findPostById(id));

    if (errOnPost) {
      throw new AppError(Messages.POST.FIND_ONE.APP_ERROR, errOnPost);
    }

    if (!post) {
      throw new NotFoundError(Messages.POST.FIND_ONE.NOT_FOUND);
    }

    return post!;
  }

  async getPosts(username: string, query: Pagination): Promise<PostsResponse> | never {
    const { usersRepository, postsRepository } = this.dependencies;

    const [user, errOnUser] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnUser) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnUser);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    const [postResponse, errOnPosts] = await handleAsync(postsRepository.getPosts(user.id, query));

    if (errOnPosts) {
      throw new AppError(Messages.POST.FIND_ALL.APP_ERROR, errOnPosts);
    }

    const [posts = [], total = 0] = postResponse!;

    return {
      posts,
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async deletePost(id: number): Promise<Post[]> | never {
    const [deletedPost, errOnDelete] = await handleAsync(
      this.dependencies.postsRepository.deletePost(id),
    );

    if (errOnDelete) {
      throw new AppError(Messages.POST.DELETE.APP_ERROR, errOnDelete);
    }

    if (!deletedPost) {
      throw new NotFoundError(Messages.POST.FIND_ONE.NOT_FOUND);
    }

    const [postResponse, errOnPosts] = await handleAsync(
      this.dependencies.postsRepository.getPosts(deletedPost!.userId, {
        order: { by: 'createdAt', type: Sorting.DESCENDING },
      } as Pagination),
    );

    if (errOnPosts) {
      throw new AppError(Messages.POST.FIND_ALL.APP_ERROR, errOnPosts);
    }

    const [posts] = postResponse!;

    return posts!;
  }

  async getLikes(postId: number, query?: Pagination): Promise<UsersResponse> | never {
    const [likeResponse, errOnLikes] = await handleAsync(
      this.dependencies.postsRepository.getLikes(postId, query),
    );

    if (errOnLikes) {
      throw new AppError(Messages.USERS.FIND_ALL.APP_ERROR, errOnLikes);
    }

    const [users = [], total = 0] = likeResponse!;

    return {
      users: users.map(createUserForPublic),
      total,
      page: query?.page,
      limit: query?.limit,
    };
  }

  async likePost(postId: number, authenticatedUserId: number): Promise<boolean> | never {
    const { postsRepository } = this.dependencies;

    const [post, errOnFindPost] = await handleAsync(postsRepository.findPostById(postId));

    if (errOnFindPost) {
      throw new AppError(Messages.POST.FIND_ONE.APP_ERROR, errOnFindPost);
    }

    if (!post) {
      throw new NotFoundError(Messages.POST.FIND_ONE.NOT_FOUND);
    }

    const [result, errOnLikePost] = await handleAsync(
      postsRepository.like(postId, authenticatedUserId),
    );

    if (errOnLikePost) {
      throw new AppError(Messages.POST.LIKE.APP_ERROR, errOnLikePost);
    }

    return !!result;
  }

  async unlikePost(postId: number, authenticatedUserId: number): Promise<boolean> | never {
    const { postsRepository } = this.dependencies;

    const [post, errOnFindPost] = await handleAsync(postsRepository.findPostById(postId));

    if (errOnFindPost) {
      throw new AppError(Messages.POST.FIND_ONE.APP_ERROR, errOnFindPost);
    }

    if (!post) {
      throw new NotFoundError(Messages.POST.FIND_ONE.NOT_FOUND);
    }

    const [result, errOnPost] = await handleAsync(
      postsRepository.unlike(postId, authenticatedUserId),
    );

    if (errOnPost) {
      throw new AppError(Messages.POST.UNLIKE.APP_ERROR, errOnPost);
    }

    return !!result;
  }
}
