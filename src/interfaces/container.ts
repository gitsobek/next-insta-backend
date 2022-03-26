import type { RoutingDependencies } from '../routes';
import type {
  AppDependencies,
  CommonDependencies,
  ConfigDependencies,
  DatabaseDependencies,
  MiddlewareDependencies,
} from './app';

export type ContainerDependencies = 
  AppDependencies &
  ConfigDependencies &
  DatabaseDependencies &
  CommonDependencies &
  RoutingDependencies &
  MiddlewareDependencies;
