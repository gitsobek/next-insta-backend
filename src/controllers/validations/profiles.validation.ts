import type { Pagination } from '../../interfaces/pagination';
import { Joi } from 'celebrate';
import type { CommonDependencies, ValidationSchema } from '../../interfaces/app';
import type { ProfileHandlers } from '../profiles';

export function createValidationSchemasForProfiles({
  validator,
}: CommonDependencies): Partial<ValidationSchema<ProfileHandlers>> {
  const addStory = validator({
    body: Joi.object({
      photoUrl: Joi.string().required(),
    }).required(),
  });

  const getStories = validator({
    params: Joi.object({
      username: Joi.string().required(),
    }).required(),
  });

  const deleteStory = validator({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
  });

  const getProfileByUsername = validator({
    params: Joi.object({
      username: Joi.string().required(),
    }).required(),
  });

  const getFollowers = validator({
    params: Joi.object({
      username: Joi.string().required(),
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

  const getFollowingUsers = validator({
    params: Joi.object({
      username: Joi.string().required(),
    }).required(),
    query: Joi.object<Pagination>({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(1000),
      order: Joi.object({
        by: Joi.string().valid('username', 'createdAt', 'updatedAt'),
        type: Joi.string().valid('asc', 'desc'),
      }),
      filter: Joi.object({
        username: Joi.string(),
        createdAt: Joi.string(),
      }),
    }).unknown(),
  });

  const followUser = validator({
    params: Joi.object({
      username: Joi.string().required(),
    }).required(),
  });

  const unfollowUser = validator({
    params: Joi.object({
      username: Joi.string().required(),
    }).required(),
  });

  return {
    addStory,
    getStories,
    deleteStory,
    getProfileByUsername,
    getFollowers,
    getFollowingUsers,
    followUser,
    unfollowUser,
  };
}
