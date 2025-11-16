import { Injectable } from '@nestjs/common';

@Injectable()
export class BotsService {
  async findAll() {
    return { message: 'FindAll bots - to be implemented' };
  }

  async create(body: any) {
    return { message: 'Create bot - to be implemented' };
  }

  async findOne(botId: string) {
    return { message: 'FindOne bot - to be implemented' };
  }

  async update(botId: string, body: any) {
    return { message: 'Update bot - to be implemented' };
  }

  async remove(botId: string) {
    return { message: 'Remove bot - to be implemented' };
  }

  async getFlow(botId: string) {
    return { message: 'GetFlow - to be implemented' };
  }

  async updateFlow(botId: string, body: any) {
    return { message: 'UpdateFlow - to be implemented' };
  }
}

