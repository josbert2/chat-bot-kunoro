import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { BotsService } from './bots.service';

@Controller('bots')
@UseGuards() // TODO: Agregar guard de autenticación
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Get()
  async findAll() {
    return this.botsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.botsService.create(body);
  }

  @Get(':botId')
  async findOne(@Param('botId') botId: string) {
    return this.botsService.findOne(botId);
  }

  @Patch(':botId')
  async update(@Param('botId') botId: string, @Body() body: any) {
    return this.botsService.update(botId, body);
  }

  @Delete(':botId')
  async remove(@Param('botId') botId: string) {
    return this.botsService.remove(botId);
  }

  @Get(':botId/flow')
  async getFlow(@Param('botId') botId: string) {
    return this.botsService.getFlow(botId);
  }

  @Post(':botId/flow')
  async updateFlow(@Param('botId') botId: string, @Body() body: any) {
    return this.botsService.updateFlow(botId, body);
  }
}

