import type { ControllerDependencies } from '../controllers';
import type { RoutingDependencies } from '../routes';
import type { ServiceDependencies } from '../services';
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
  ServiceDependencies &
  MiddlewareDependencies &
  ValidationSchemaDependencies
