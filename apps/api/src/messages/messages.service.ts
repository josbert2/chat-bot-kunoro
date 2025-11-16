import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  async create(conversationId: string, content: string, authorType: string) {
    // TODO: Implementar creación de mensaje
    return { message: 'Create message - to be implemented' };
  }

  async findByConversation(conversationId: string) {
    // TODO: Implementar búsqueda de mensajes por conversación
    return { message: 'FindByConversation - to be implemented' };
  }
}

