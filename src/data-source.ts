import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

console.log(__dirname);

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User, Report],
  migrations: [__dirname + '/migrations/*.ts'],
} as DataSourceOptions);
