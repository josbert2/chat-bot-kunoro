import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
@UseGuards() // TODO: Agregar guard de autenticación
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.conversationsService.findAll(query);
  }

  @Get(':conversationId')
  async findOne(@Param('conversationId') conversationId: string) {
    return this.conversationsService.findOne(conversationId);
  }

  @Patch(':conversationId')
  async update(@Param('conversationId') conversationId: string, @Body() body: any) {
    return this.conversationsService.update(conversationId, body);
  }
}

