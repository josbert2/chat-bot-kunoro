import { Injectable } from '@nestjs/common';

@Injectable()
export class EndUsersService {
  async findAll(query: any) {
    return { message: 'FindAll end-users - to be implemented' };
  }

  async findOne(endUserId: string) {
    return { message: 'FindOne end-user - to be implemented' };
  }

  async update(endUserId: string, body: any) {
    return { message: 'Update end-user - to be implemented' };
  }
}

