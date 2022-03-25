import { RoutingDependencies } from '../routes';
import { AppDependencies, CommonDependencies, ConfigDependencies, DatabaseDependencies, MiddlewareDependencies } from './app';

export type ContainerDependencies = 
  AppDependencies &
  ConfigDependencies &
  DatabaseDependencies &
  CommonDependencies &
  RoutingDependencies &
  MiddlewareDependencies;
