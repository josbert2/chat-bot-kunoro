import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AutomationsService } from './automations.service';

@Controller('automations')
@UseGuards() // TODO: Agregar guard de autenticación
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Get()
  async findAll() {
    return this.automationsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.automationsService.create(body);
  }

  @Get(':automationId')
  async findOne(@Param('automationId') automationId: string) {
    return this.automationsService.findOne(automationId);
  }

  @Patch(':automationId')
  async update(@Param('automationId') automationId: string, @Body() body: any) {
    return this.automationsService.update(automationId, body);
  }

  @Delete(':automationId')
  async remove(@Param('automationId') automationId: string) {
    return this.automationsService.remove(automationId);
  }
}

