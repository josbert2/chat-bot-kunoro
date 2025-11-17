import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { DatabaseService } from './database.service';

@Module({
  providers: [ConfigService, DatabaseService],
  exports: [ConfigService, DatabaseService],
})
export class ConfigModule {}

