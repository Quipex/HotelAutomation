/* eslint-disable class-methods-use-this */
import { Logger } from 'typeorm';
import { appendRequestIdIfPresent } from '~/common/utils/logging';
import { log, migrationLog, queryLog } from './logger';

class TypeormLogger implements Logger {
  log(level: 'log' | 'info' | 'warn', message: any): any {
    if (level === 'warn') {
      log.warn(appendRequestIdIfPresent(message));
      return;
    }
    log.info(appendRequestIdIfPresent(message));
  }

  logMigration(message: string): any {
    migrationLog.info(message);
  }

  logQuery(query: string, parameters: any[] = []): any {
    queryLog.info(appendRequestIdIfPresent(query), { parameters });
  }

  logQueryError(error: string | Error, query: string, parameters: any[] = []): any {
    queryLog.error(appendRequestIdIfPresent(error), { query, parameters });
  }

  logQuerySlow(time: number, query: string, parameters: any[] = []): any {
    queryLog.warn(appendRequestIdIfPresent('Slow query'), { query, parameters, time });
  }

  logSchemaBuild(message: string): any {
    queryLog.info(message);
  }
}

export { TypeormLogger };
