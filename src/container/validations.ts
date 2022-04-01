import { asFunction, type AwilixContainer } from 'awilix';
import { createValidationSchemasForUsers } from '../controllers/validations/users.validation';
import type { ValidationSchemaDependencies } from '../interfaces/app';

export function registerValidationSchemas(container: AwilixContainer): AwilixContainer<ValidationSchemaDependencies> {
  container.register({
    usersValidation: asFunction(createValidationSchemasForUsers).singleton(),
  });

  return container;
}
