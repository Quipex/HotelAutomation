import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { getEnv } from './env';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: getEnv('DB_HOST') || 'localhost',
  port: Number(getEnv('DB_PORT')) || 5432,
  username: getEnv('DB_USER') || 'postgres',
  password: getEnv('DB_PASS') || 'admin',
  database: getEnv('DB_DATABASE') || 'hotel_integration',
  entities: [
    'src/domain/**/*Model.ts'
  ],
  logging: true,
  migrations: [
    'migration/**/*.ts'
  ],
  cli: {
    migrationsDir: 'migration'
  }
};

export default config;
