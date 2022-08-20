import { SchedulerJobSetup, SchedulerJobType, SchedulerRule } from '../interfaces/scheduler';

export const INITIAL_JOBS: SchedulerJobSetup[] = [
  {
    name: 'Remove story 24h',
    type: SchedulerJobType.INTERNAL,
    configuration: {
      cron: '* * * * *',
    },
    runTaskName: 'deleteStoryAfterFullDay',
    rule: SchedulerRule.NORMAL,
  },
];
