import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ChannelsService } from './channels.service';

@Controller('channels')
@UseGuards() // TODO: Agregar guard de autenticación
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  async findAll() {
    return this.channelsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.channelsService.create(body);
  }

  @Get(':channelId')
  async findOne(@Param('channelId') channelId: string) {
    return this.channelsService.findOne(channelId);
  }

  @Patch(':channelId')
  async update(@Param('channelId') channelId: string, @Body() body: any) {
    return this.channelsService.update(channelId, body);
  }

  @Delete(':channelId')
  async remove(@Param('channelId') channelId: string) {
    return this.channelsService.remove(channelId);
  }
}

