import { config } from 'dotenv';
import { ConnectionOptions } from 'typeorm';

config();

const ormConfig: ConnectionOptions = {
  cli: {
    migrationsDir: 'src/migrations',
  },
  database: process.env.POSTGRES_DATABASE,
  entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
  host: process.env.POSTGRES_HOST,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrate',
  password: process.env.POSTGRES_PASSWORD,
  port: +process.env.POSTGRES_PORT,
  synchronize: true,
  type: 'postgres',
  username: process.env.POSTGRES_USER,
};
export default ormConfig;
