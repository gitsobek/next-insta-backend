import { Joi } from 'celebrate';
import type { CommonDependencies, ValidationSchema } from '../../interfaces/app';
import type { User } from '../../interfaces/user';
import type { Pagination } from '../../interfaces/pagination';
import type { UserHandlers } from '../users';

export function createValidationSchemasForUsers({
  validator,
  appConfig,
}: CommonDependencies): Partial<ValidationSchema<UserHandlers>> {
  const login = validator({
    body: Joi.object({
      username: Joi.string().required(),
      password: Joi.string()
        .regex(appConfig.passwordRegex)
        .required()
        .messages({
          'string.pattern.base': `${appConfig.passwordValidationError}`,
        }),
    }).required(),
  });

  const refreshToken = validator({
    body: Joi.object({
      accessToken: Joi.string(),
      refreshToken: Joi.string().required()
    }).required(),
  });

  const requestPasswordReset = validator({
    body: Joi.object({
      username: Joi.string().required(),
    }).required(),
  });

  const resetPassword = validator({
    body: Joi.object({
      resetToken: Joi.string().required(),
      newPassword: Joi.string()
        .regex(appConfig.passwordRegex)
        .required()
        .messages({
          'string.pattern.base': `${appConfig.passwordValidationError}`,
        }),
    }).required(),
  });

  const changePassword = validator({
    body: Joi.object({
      oldPassword: Joi.string()
        .regex(appConfig.passwordRegex)
        .required()
        .messages({
          'string.pattern.base': `${appConfig.passwordValidationError}`,
        }),
      newPassword: Joi.string()
        .regex(appConfig.passwordRegex)
        .required()
        .messages({
          'string.pattern.base': `${appConfig.passwordValidationError}`,
        }),
    }).required(),
  });

  const getUserById = validator({
    params: Joi.object({
      userId: Joi.number().integer().min(0).required(),
    }).required(),
  });

  const getUserByUsername = validator({
    params: Joi.object<User>({
      username: Joi.string().required(),
    }).required(),
  });

  const getUsers = validator({
    query: Joi.object<Pagination>({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(1000),
      order: Joi.object({
        by: Joi.string().valid('username', 'createdAt', 'updatedAt'),
        type: Joi.string().valid('asc', 'desc'),
      }),
    }).unknown(),
  });

  const createUser = validator({
    body: Joi.object<User>({
      email: Joi.string().email().required(),
      username: Joi.string().required(),
      password: Joi.string()
        .regex(appConfig.passwordRegex)
        .required()
        .messages({
          'string.pattern.base': `${appConfig.passwordValidationError}`,
        }),
    }).required(),
  });

  const updateUser = validator({
    body: Joi.object<User>({
      email: Joi.string().email().min(4).max(128),
      avatar: Joi.string().max(1024),
      gender: Joi.valid('male', 'female', 'unknown'),
      firstName: Joi.string().min(1).max(50),
      lastName: Joi.string().min(1).max(50),
      bio: Joi.string().min(1).max(1024),
      phoneNumber: Joi.string().min(1).max(26),
    }).required(),
  });

  return {
    login,
    refreshToken,
    requestPasswordReset,
    resetPassword,
    changePassword,
    getUserById,
    getUserByUsername,
    getUsers,
    createUser,
    updateUser
  };
}
