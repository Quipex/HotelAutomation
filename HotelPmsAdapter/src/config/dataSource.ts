import { DataSource } from 'typeorm';
import env from '~/config/env';

const appDataSource = new DataSource({
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
});

export default appDataSource;
