import { koaMiddleware as rTracer } from 'cls-rtracer';
import Application from 'koa';
import bodyParser from 'koa-bodyparser';
import { ErrorCode, REQUEST_ID_HEADER } from '~/common/constants';
import appDataSource from '~/config/dataSource';
import env from '~/config/env';
import { log } from '~/config/logger';
import appRouter from '~/domain/AppController';
import { checkHeaderValidAndReject, logRequestAndResponseTime } from './middlewares';

const app = new Application();

app.use(rTracer({ headerName: REQUEST_ID_HEADER, useHeader: true, echoHeader: true }));
app.use(bodyParser());
app.use(checkHeaderValidAndReject);
app.use(logRequestAndResponseTime);
app.use(appRouter.routes());
app.on('close', async () => {
  try {
    await appDataSource.destroy();
  } catch (e) {
    log.error('Failed to destroy db connection', e);
    process.exit(ErrorCode.DATABASE);
  }
});

appDataSource.initialize().then(async (connection) => {
  const connectionOpts = connection.options;
  log.info('✅  A connection to database is created', {
    vendor: connectionOpts.type,
    database: connectionOpts.database,
    migrations: connectionOpts.migrations
  });

  app.listen(env.port, () => {
    log.info(`⚡️ Server is running on port ${env.port}. Environment: ${env.nodeEnv}`);
  });
}).catch((err) => {
  log.error('☠ Error while creating db connection ☠', err);
  process.exit(ErrorCode.DATABASE);
});

export default app;
