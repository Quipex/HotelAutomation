import Application from 'koa';
import bodyParser from 'koa-bodyparser';
import appDataSource from '~/config/dataSource';
import env from '~/config/env';
import { log } from '~/config/logger';
import appRouter from '~/domain/AppController';
import { checkHeaderValidAndReject, handleErrors, logRequestAndResponseTime, trackResponseTime } from './middlewares';

const app = new Application();

app.use(bodyParser());
app.use(checkHeaderValidAndReject);
app.use(trackResponseTime);
app.use(logRequestAndResponseTime);
app.on('error', handleErrors);
app.use(appRouter.routes());

appDataSource.initialize().then(async connection => {
  const connectionOpts = connection.options;
  log.info('A connection to database is created', {
    vendor: connectionOpts.type,
    database: connectionOpts.database,
    migrations: connectionOpts.migrations
  });

  app.listen(env.port, () => {
    log.info(`⚡️[server]: Server is running on port ${env.port}`);
  });
}).catch((err) => {
  log.error('Error while creating db connection', err);
  process.exit(1);
});
