import { Joi } from 'celebrate';
import type { CommonDependencies, ValidationSchema } from '../../interfaces/app';
import type { Pagination } from '../../interfaces/pagination';
import type { PostHandlers } from '../posts';

export function createValidationSchemasForPosts({
  validator,
}: CommonDependencies): Partial<ValidationSchema<PostHandlers>> {
  const addPost = validator({
    body: Joi.object({
      photoUrl: Joi.string().required(),
      description: Joi.string().max(1024),
      location: Joi.string().max(256),
    }).required(),
  });

  const getPost = validator({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
  });

  const getPosts = validator({
    params: Joi.object({
      username: Joi.string().required(),
    }).required(),
    query: Joi.object<Pagination>({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(1000),
      order: Joi.object({
        by: Joi.string().valid('createdAt'),
        type: Joi.string().valid('asc', 'desc'),
      }),
      filter: Joi.object({
        description: Joi.string(),
        createdAt: Joi.string(),
      }),
    }).unknown(),
  });

  const deletePost = validator({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
  });

  const getLikes = validator({
    params: Joi.object({
      id: Joi.string().required(),
    }).required(),
    query: Joi.object<Pagination>({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(1000),
      order: Joi.object({
        by: Joi.string().valid('username', 'createdAt'),
        type: Joi.string().valid('asc', 'desc'),
      }),
      filter: Joi.object({
        username: Joi.string(),
        createdAt: Joi.string(),
      }),
    }).unknown(),
  });

  const likePost = validator({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
  });

  const unlikePost = validator({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
  });

  return {
    addPost,
    getPost,
    getPosts,
    deletePost,
    getLikes,
    likePost,
    unlikePost,
  };
}
