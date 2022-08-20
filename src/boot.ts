import 'express-async-errors';
import { INITIAL_JOBS } from './config/scheduler';
import { createContainer } from './container';

(async () => {
  const container = await createContainer();

  const { server, logger, db, schedulerService: scheduler } = container.cradle;

  process.on('uncaughtException', (err: any) => {
    logger.error(`Uncaught: ${err.toString()}`, err);
    process.exit(1);
  });

  process.on('unhandledRejection', (err: any) => {
    if (err) {
      logger.error(`Unhandled: ${err.toString()}`, err);
    }
    process.exit(1);
  });

  try {
    await db.connect();
    logger.info('Database is up & running.');
  } catch (e) {
    logger.error(`Error while connecting to database: ${(e as Error).toString()}.`);
    process.exit(1);
  }

  scheduler.boot();
  scheduler.addInitialsJobs(INITIAL_JOBS);
  server.start();
})();
