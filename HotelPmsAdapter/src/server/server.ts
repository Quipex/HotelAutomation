import { koaMiddleware as rTracer } from 'cls-rtracer';
import Application from 'koa';
import bodyParser from 'koa-bodyparser';
import { ErrorCode, REQUEST_ID_HEADER } from '~/common/constants';
import appConfig, { appConfigPath } from '~/config/appConfig';
import appDataSource from '~/config/dataSource';
import env from '~/config/env';
import localDb, { localDbPath } from '~/config/localDb';
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

const initializeApp = () => {
  app.listen(env.port, () => {
    log.info(`⚡️ Server is running on port ${env.port}. Environment: ${env.nodeEnv}`);
  });
};

const initializeDb = () => {
  appDataSource.initialize().then(async (connection) => {
    const connectionOpts = connection.options;
    log.info('✅  A connection to database is created', {
      vendor: connectionOpts.type,
      database: connectionOpts.database,
      migrations: connectionOpts.migrations
    });
    initializeApp();
  }).catch((err) => {
    log.error('☠ Error while creating db connection ☠', err);
    process.exit(ErrorCode.DATABASE);
  });
};

const initializeAppConfig = () => {
  appConfig.read().then(() => {
    log.info(`✅  Read the contents of app config '${appConfigPath}'`);
    initializeDb();
  }).catch((e) => {
    log.error(`☠  Failed to read the contents of app config '${appConfigPath}'`, e);
    process.exit(1);
  });
};

const initializeEverything = () => {
  localDb.read().then(() => {
    log.info(`✅  Read the contents of local db '${localDbPath}'`);
    initializeAppConfig();
  }).catch((e) => {
    log.error(`☠  Failed to read the contents of local db '${localDbPath}'`, e);
    process.exit(1);
  });
};

initializeEverything();

export default app;
