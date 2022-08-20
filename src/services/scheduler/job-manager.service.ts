import { ServiceDependencies } from '..';
import { SchedulerJob, SchedulerJobType } from '../../interfaces/scheduler';

export class JobManager {
  constructor(private readonly dependencies: ServiceDependencies) {}

  execute(job: SchedulerJob): Promise<{ data: unknown }> {
    switch (job.type) {
      case SchedulerJobType.INTERNAL: {
        return this.dependencies.internalJobManager.execute(job);
      }
      default: {
        throw new Error(`[Scheduler] Job of type ${job.type} is not a supported strategy.`);
      }
    }
  }
}
