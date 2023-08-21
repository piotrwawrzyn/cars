import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
const Migration = require('../migrations/1692647340154-initial-schema');

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // TODO: Implement switching between dev, test and prod based on env variables

    const devConfig = {
      type: 'sqlite',
      synchronize: false,
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
    };

    const testConfig = {
      type: 'sqlite',
      synchronize: false,
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      migrations: [Migration],
      migrationsRun: true,
    };

    const prodConfig = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: false,
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      migrations: [Migration],
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false,
      },
    };

    return prodConfig as TypeOrmModuleOptions;
  }
}
