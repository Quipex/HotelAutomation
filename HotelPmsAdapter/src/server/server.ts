import Application from 'koa';
import bodyParser from 'koa-bodyparser';
import { createConnection, getConnectionOptions } from 'typeorm';
import { log } from '~/config/logger';
import env from '~/config/env';
import appRouter from '~/domain/AppController';
import {
  checkHeaderValidAndReject, logRequestAndResponseTime, trackResponseTime, handleErrors
} from './middlewares';

const app = new Application();

app.use(bodyParser());
app.use(checkHeaderValidAndReject);
app.use(trackResponseTime);
app.use(logRequestAndResponseTime);
app.on('error', handleErrors);
app.use(appRouter.routes());

createConnection().then(async () => {
  const connectionOpts = await getConnectionOptions();
  log.info('A connection to database is created', {
    vendor: connectionOpts.type,
    database: connectionOpts.database
  });

  app.listen(env.port, () => {
    log.info(`⚡️[server]: Server is running on port ${env.port}`);
  });
}).catch((err) => {
  log.error('Error while creating db connection', err);
  process.exit(1);
});
