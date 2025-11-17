import { Injectable } from '@nestjs/common';

@Injectable()
export class JobsProcessor {
  // TODO: Implementar procesadores de trabajos con BullMQ
  async processJob(job: any) {
    return { message: 'ProcessJob - to be implemented' };
  }
}

