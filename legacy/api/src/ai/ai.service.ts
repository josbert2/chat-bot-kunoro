import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async suggestReply(conversationId: string, lastMessage: string) {
    // TODO: Implementar sugerencia de respuesta con IA
    return { message: 'SuggestReply - to be implemented' };
  }
}

