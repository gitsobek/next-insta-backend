import { Joi } from 'celebrate';
import type { CommonDependencies, ValidationSchema } from '../../interfaces/app';
import type { Pagination } from '../../interfaces/pagination';
import type { CommentHandlers } from '../comments';

export function createValidationSchemasForComments({
  validator,
}: CommonDependencies): Partial<ValidationSchema<CommentHandlers>> {
  const addComment = validator({
    params: Joi.object({
      postId: Joi.number().required(),
    }).required(),
    body: Joi.object({
      text: Joi.string().max(1024).required(),
    }).required(),
  });

  const getComments = validator({
    params: Joi.object({
      postId: Joi.number().required(),
    }).required(),
    query: Joi.object<Pagination>({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(1000),
      order: Joi.object({
        by: Joi.string().valid('createdAt'),
        type: Joi.string().valid('asc', 'desc'),
      }),
      filter: Joi.object({
        likes: Joi.number(),
        createdAt: Joi.string(),
      }),
    }).unknown(),
  });

  const deleteComment = validator({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
  });

  const likeComment = validator({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
  });

  const unlikeComment = validator({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
  });

  return {
    addComment,
    getComments,
    deleteComment,
    likeComment,
    unlikeComment,
  };
}
