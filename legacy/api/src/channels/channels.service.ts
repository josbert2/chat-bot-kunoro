import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelsService {
  async findAll() {
    return { message: 'FindAll channels - to be implemented' };
  }

  async create(body: any) {
    return { message: 'Create channel - to be implemented' };
  }

  async findOne(channelId: string) {
    return { message: 'FindOne channel - to be implemented' };
  }

  async update(channelId: string, body: any) {
    return { message: 'Update channel - to be implemented' };
  }

  async remove(channelId: string) {
    return { message: 'Remove channel - to be implemented' };
  }
}

