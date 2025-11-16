import { Module } from '@nestjs/common';
import { EndUsersController } from './end-users.controller';
import { EndUsersService } from './end-users.service';

@Module({
  controllers: [EndUsersController],
  providers: [EndUsersService],
  exports: [EndUsersService],
})
export class EndUsersModule {}

