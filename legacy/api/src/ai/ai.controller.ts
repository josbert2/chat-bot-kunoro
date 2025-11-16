import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards() // TODO: Agregar guard de autenticación
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest-reply')
  async suggestReply(@Body() body: { conversationId: string; lastMessage: string }) {
    return this.aiService.suggestReply(body.conversationId, body.lastMessage);
  }
}

