import * as Bull from 'bull';
import { v4 } from 'uuid';
import type { Queue, Job, CronRepeatOptions } from 'bull';
import {
  type SchedulerJob,
  type SchedulerJobConfiguration,
  type SchedulerJobSetup,
  SchedulerRule,
  SchedulerJobType,
} from '../../interfaces/scheduler';
import type { ContainerDependencies } from '../../interfaces/container';

export class SchedulerService {
  private readonly jobQueue: Queue<SchedulerJob>;

  constructor(private readonly dependencies: ContainerDependencies) {
    this.jobQueue = new Bull(
      this.dependencies.appConfig.schedulerConfig.queueName,
      this.dependencies.appConfig.redisUrl,
    );
    this.queue.client.on('connect', async () => {
      this.dependencies.logger.info('Queue server is up & running.');

      try {
        const internalJobs = (
          await this.queue.getJobs(['active', 'completed', 'delayed', 'failed', 'paused', 'waiting'])
        ).filter((job) => job.data.type === SchedulerJobType.INTERNAL);

        for (let job of internalJobs) {
          await job.remove();
        }
        this.dependencies.logger.info(`[Scheduler] All jobs have been synchronized`);
      } catch (err) {
        this.dependencies.logger.error(`[Scheduler] Failed to synchronize jobs in queue: ${(err as Error).message}`);
      }
    });
  }

  get queue(): Queue<SchedulerJob> {
    return this.jobQueue;
  }

  boot(): void {
    const { jobManager, logger } = this.dependencies;

    this.queue.process(async (job: Job) => {
      try {
        await jobManager.execute(job.data);
      } catch (err) {
        logger.error(`[Scheduler] Failed to handle a job: ${(err as Error).message}`);
      }
    });
    this.queue
      .on('active', (job: Job) => {
        logger.info(`[Scheduler] Job: "${job.data.name}" has started`);
      })
      .on('completed', (job: Job) => {
        if (job.finishedOn) {
          logger.info(`[Scheduler] Job: "${job.data.name}" executed successfully`);
        }
      })
      .on('error', (error: Error) => {
        logger.error(`[Scheduler] Queue error: ${error.message}`);
      });
  }

  async createScheduledJob(jobSetup: SchedulerJobSetup): Promise<Job<SchedulerJob>> {
    const { attempts, timeBetweenAttempts } = this.dependencies.appConfig.schedulerConfig;
    const { name, type, runTaskName, configuration } = jobSetup;

    const job: SchedulerJob = {
      name,
      type,
      runTaskName,
      configuration,
    };

    return this.queue.add(job, {
      jobId: v4(),
      ...jobSetup.configuration,
      repeat: configuration?.cron ? this.createRepeatOptions(configuration) : undefined,
      attempts: configuration?.attempts || attempts,
      backoff: configuration?.backoff || timeBetweenAttempts,
    });
  }

  async addInitialsJobs(jobs: SchedulerJobSetup[]): Promise<void> {
    for (let job of jobs) {
      await this.processInitialJob(job);
    }
  }

  async cancelJob(name: string): Promise<void> {
    return this.queue.getJobs(['active', 'waiting', 'delayed']).then((jobs) => {
      const job = jobs.find((job: Job) => job.data.name === name);

      if (job) {
        return job.remove();
      }

      return Promise.reject();
    });
  }

  private async processInitialJob(initialJob: SchedulerJobSetup): Promise<Job<SchedulerJob> | void> {
    const { logger } = this.dependencies;

    if (initialJob.rule === SchedulerRule.OVERWRITE) {
      return this.cancelJob(initialJob.name)
        .then(() => this.createScheduledJob(initialJob))
        .then(
          (job) => (
            logger.info(`[Scheduler] Initial job: "${initialJob.name}" has overwritten existing job`), Promise.resolve(job)
          ),
        )
        .catch((error) =>
          logger.info(`[Scheduler] Error: "${error.message}" while overwriting initial job: ${initialJob.name}`),
        ) as Promise<Job<SchedulerJob>>;
    }

    if (initialJob.rule === SchedulerRule.DELETE) {
      return this.cancelJob(initialJob.name)
        .then(() => (logger.info(`[Scheduler] Job: "${initialJob.name}" has been deleted`), Promise.resolve()))
        .catch((error) =>
          logger.info(`[Scheduler] Error: "${error.message}" while deleting job: ${initialJob.name}`),
        ) as Promise<void>;
    }

    return this.createScheduledJob(initialJob)
      .then((job) => (logger.info(`[Scheduler] Initial job: "${initialJob.name}" has been added`), Promise.resolve(job)))
      .catch((error) =>
        logger.info(`[Scheduler] Error: "${error.message}" while adding initial job: ${initialJob.name}`),
      ) as Promise<Job<SchedulerJob>>;
  }

  private createRepeatOptions(config: SchedulerJobConfiguration): CronRepeatOptions {
    return {
      cron: config.cron!,
      tz: config.cronTimeZone,
      startDate: config.cronStartDate ? new Date(config.cronStartDate) : undefined,
      endDate: config.cronEndDate ? new Date(config.cronEndDate) : undefined,
    };
  }
}
