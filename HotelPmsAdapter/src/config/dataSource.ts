import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeormLogger } from '~/config/TypeormLogger';
import env from '~/config/env';

const defaultConfig: DataSourceOptions = {
  type: env.db.type as any,
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  migrations: ['**/migrations/**/*.{ts,js}'],
  entities: ['**/domain/**/*Model.{ts,js}'],
  migrationsRun: env.typeorm.migrationsRun,
  logging: env.typeorm.logging,
  synchronize: env.typeorm.synchronize,
  logger: new TypeormLogger()
};

const testConfig: DataSourceOptions = {
  ...defaultConfig,
  database: env.db.databaseTest
};

const config = env.nodeEnv === 'test' ? testConfig : defaultConfig;

const appDataSource = new DataSource(config);

export default appDataSource;
