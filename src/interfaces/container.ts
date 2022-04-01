import type { ControllerDependencies } from '../controllers';
import type { RoutingDependencies } from '../routes';
import type {
  AppDependencies,
  CommonDependencies,
  ConfigDependencies,
  DatabaseDependencies,
  MiddlewareDependencies,
  ValidationSchemaDependencies,
} from './app';

export type ContainerDependencies = 
  AppDependencies &
  ConfigDependencies &
  DatabaseDependencies &
  CommonDependencies &
  RoutingDependencies &
  ControllerDependencies &
  MiddlewareDependencies &
  ValidationSchemaDependencies
