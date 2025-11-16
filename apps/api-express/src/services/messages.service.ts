import { v4 as uuidv4 } from 'uuid';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { messages, conversations } from '../db/schema.js';
import { AppError } from '../middleware/error.middleware.js';

interface CreateMessageInput {
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: string; // Categoría del mensaje
}

class MessagesService {
  async findByConversation(conversationId: string, accountId: string, options?: { limit?: number; offset?: number }) {
    console.log('🟢 [MESSAGES SERVICE] Obteniendo mensajes de conversación:', conversationId);

    const database = await db.connect();

    // Verificar que la conversación pertenece a la cuenta
    const [conversation] = await database
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation || conversation.accountId !== accountId) {
      throw new AppError(404, 'Conversación no encontrada');
    }

    const limit = options?.limit || 100;
    const offset = options?.offset || 0;

    const result = await database
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt) // ASC para mostrar del más antiguo al más nuevo
      .limit(limit)
      .offset(offset);

    console.log(`✅ [MESSAGES SERVICE] ${result.length} mensajes obtenidos`);

      // Retornar en formato que espera el frontend
      return result.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.role, // 'user' o 'assistant' -> se mapea a 'user' o 'agent'
        timestamp: msg.createdAt,
        intent: msg.intent, // Incluir la categoría del mensaje
      }));
  }

  async create(accountId: string, input: CreateMessageInput) {
    console.log('🟢 [MESSAGES SERVICE] Creando mensaje en conversación:', input.conversationId);

    const database = await db.connect();

    // Verificar que la conversación pertenece a la cuenta
    const [conversation] = await database
      .select()
      .from(conversations)
      .where(eq(conversations.id, input.conversationId))
      .limit(1);

    if (!conversation || conversation.accountId !== accountId) {
      throw new AppError(404, 'Conversación no encontrada');
    }

    const messageId = `msg_${uuidv4()}`;

    await database.insert(messages).values({
      id: messageId,
      conversationId: input.conversationId,
      role: input.role,
      content: input.content,
      intent: input.intent || null,
    });

    const [newMessage] = await database
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);

    console.log('✅ [MESSAGES SERVICE] Mensaje creado:', messageId);

    return {
      success: true,
      data: {
        ...newMessage,
        createdAt: newMessage.createdAt.toISOString(),
      },
    };
  }

  async findOne(messageId: string, accountId: string) {
    console.log('🟢 [MESSAGES SERVICE] Obteniendo mensaje:', messageId);

    const database = await db.connect();

    const [message] = await database
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);

    if (!message) {
      throw new AppError(404, 'Mensaje no encontrado');
    }

    // Verificar que pertenece a la cuenta
    const [conversation] = await database
      .select()
      .from(conversations)
      .where(eq(conversations.id, message.conversationId))
      .limit(1);

    if (!conversation || conversation.accountId !== accountId) {
      throw new AppError(404, 'Mensaje no encontrado');
    }

    return {
      success: true,
      data: {
        ...message,
        createdAt: message.createdAt.toISOString(),
      },
    };
  }
}

export const messagesService = new MessagesService();

