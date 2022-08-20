import type { ContainerDependencies } from '../../interfaces/container';
import type { SchedulerJob } from '../../interfaces/scheduler';

export type InternalJobManagerTask = 'deleteStoryAfterFullDay';

export class InternalJobManager {
  private readonly internalJobs: Map<InternalJobManagerTask, () => Promise<unknown>>;

  constructor(private readonly dependencies: ContainerDependencies) {
    this.internalJobs = new Map<InternalJobManagerTask, () => Promise<unknown>>().set(
      'deleteStoryAfterFullDay',
      this.deleteStoryAfterFullDay,
    );
  }

  async execute(job: SchedulerJob): Promise<{ data: unknown }> {
    const task = this.internalJobs.get(job.runTaskName!);

    if (!task) {
      throw new Error('[Scheduler] Invalid or missing internal task');
    }

    return task.apply(this).then((data) => ({ data }));
  }

  private async deleteStoryAfterFullDay(): Promise<number> {
    return this.dependencies.profilesRepository.deleteStoryOlderThanPeriod('24 hours');
  }
}
