import { Injectable } from '@nestjs/common';

@Injectable()
export class JobsService {
  async enqueueJob(jobType: string, data: any) {
    // TODO: Implementar cola de trabajos con BullMQ
    return { message: 'EnqueueJob - to be implemented' };
  }
}

