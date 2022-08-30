import { asFunction, type AwilixContainer } from 'awilix';
import { createValidationSchemasForPosts } from '../controllers/validations/posts.validation';
import { createValidationSchemasForProfiles } from '../controllers/validations/profiles.validation';
import { createValidationSchemasForUsers } from '../controllers/validations/users.validation';
import type { ValidationSchemaDependencies } from '../interfaces/app';

export function registerValidationSchemas(container: AwilixContainer): AwilixContainer<ValidationSchemaDependencies> {
  container.register({
    usersValidation: asFunction(createValidationSchemasForUsers).singleton(),
    profilesValidation: asFunction(createValidationSchemasForProfiles).singleton(),
    postsValidation: asFunction(createValidationSchemasForPosts).singleton(),
  });

  return container;
}
