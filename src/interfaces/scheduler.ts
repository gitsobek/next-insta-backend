import type { InternalJobManagerTask } from "../services";

export enum SchedulerJobType {
  INTERNAL = 'internal',
}

export enum SchedulerRule {
  NORMAL = 'normal',
  OVERWRITE = 'overwrite',
  DELETE = 'delete',
}

export interface SchedulerEnvironmentConfig {
  queueName: string;
  attempts: number;
  timeBetweenAttempts: number;
}

export interface SchedulerJobConfiguration {
  priority?: number;
  delay?: number;
  attempts?: number;
  cron?: string;
  cronStartDate?: string;
  cronEndDate?: string;
  cronTimeZone?: string;
  cronLimit?: number;
  backoff?: number;
  lifo?: boolean;
  timeout?: number;
  removeOnComplete?: boolean;
  removeOnFail?: boolean;
  stackTraceLimit?: number;
}

export type SchedulerJobSetup = {
  name: string;
  type: SchedulerJobType;
  configuration: SchedulerJobConfiguration;
  runTaskName?: InternalJobManagerTask;
  rule?: SchedulerRule;
};

export interface SchedulerJob {
  name: string;
  type: SchedulerJobType;
  configuration: SchedulerJobConfiguration;
  runTaskName?: InternalJobManagerTask;
}
