import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { EndUsersService } from './end-users.service';

@Controller('end-users')
@UseGuards() // TODO: Agregar guard de autenticación
export class EndUsersController {
  constructor(private readonly endUsersService: EndUsersService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.endUsersService.findAll(query);
  }

  @Get(':endUserId')
  async findOne(@Param('endUserId') endUserId: string) {
    return this.endUsersService.findOne(endUserId);
  }

  @Patch(':endUserId')
  async update(@Param('endUserId') endUserId: string, @Body() body: any) {
    return this.endUsersService.update(endUserId, body);
  }
}

