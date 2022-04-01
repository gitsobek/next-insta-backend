import { CommonDependencies, ValidationSchema } from '../../interfaces/app';
import { Joi } from 'celebrate';
import { UserService } from '../../services';

export function createValidationSchemasForUsers({ validator }: CommonDependencies): ValidationSchema<UserService> {
  const getUsers = validator({
    query: Joi.object({
      page: Joi.number().integer().min(1),
      limit: Joi.number().integer().min(1).max(1000),
      order: Joi.object({
        by: Joi.string().valid('username', 'createdAt', 'updatedAt'),
        type: Joi.string().valid('asc', 'desc'),
      }),
    }).unknown(),
  })

  return {
    getUsers,
  };
}
