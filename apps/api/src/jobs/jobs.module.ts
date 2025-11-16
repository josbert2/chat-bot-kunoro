import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsProcessor } from './jobs.processor';

@Module({
  providers: [JobsService, JobsProcessor],
  exports: [JobsService],
})
export class JobsModule {}

