import { v4 as uuidv4 } from 'uuid';
import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { conversations, sites, messages } from '../db/schema.js';
import { AppError } from '../middleware/error.middleware.js';

interface CreateConversationInput {
  siteId: string;
  visitorId?: string;
  metadata?: any;
}

class ConversationsService {
  async findAll(accountId: string, query: { siteId?: string; status?: string; limit?: number; offset?: number }) {
    console.log('🟢 [CONVERSATIONS SERVICE] Listando conversaciones para cuenta:', accountId);

    const database = await db.connect();
    const limit = query.limit || 50;
    const offset = query.offset || 0;

    // Si hay siteId, verificar que pertenece a la cuenta
    if (query.siteId) {
      const [site] = await database
        .select()
        .from(sites)
        .where(and(eq(sites.id, query.siteId), eq(sites.accountId, accountId)))
        .limit(1);

      if (!site) {
        throw new AppError(404, 'Sitio no encontrado');
      }
    }

    // Construir query
    let conditions = [eq(conversations.accountId, accountId)];
    if (query.siteId) {
      conditions.push(eq(conversations.siteId, query.siteId));
    }
    if (query.status) {
      conditions.push(eq(conversations.status, query.status));
    }

    const result = await database
      .select()
      .from(conversations)
      .where(and(...conditions))
      .orderBy(desc(conversations.updatedAt))
      .limit(limit)
      .offset(offset);

    // Para cada conversación, obtener el último mensaje
    const conversationsWithMessages = await Promise.all(
      result.map(async (conv) => {
        // Obtener último mensaje
        const [lastMsg] = await database
          .select()
          .from(messages)
          .where(eq(messages.conversationId, conv.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        // Parsear metadata para obtener nombre del visitante
        const metadata = conv.metadata ? JSON.parse(conv.metadata) : {};
        const visitorName = metadata.name || metadata.email || conv.visitorId || 'Visitante';

        return {
          id: conv.id,
          endUserId: conv.visitorId || 'unknown',
          endUserName: visitorName,
          lastMessage: lastMsg?.content || 'Sin mensajes',
          lastMessageAt: lastMsg?.createdAt || conv.createdAt,
          unread: true, // TODO: Implementar lógica de leído/no leído
          status: conv.status,
          createdAt: conv.createdAt.toISOString(),
          updatedAt: conv.updatedAt.toISOString(),
          metadata,
        };
      })
    );

    console.log(`✅ [CONVERSATIONS SERVICE] ${conversationsWithMessages.length} conversaciones procesadas`);

    return conversationsWithMessages;
  }

  async findOne(conversationId: string, accountId: string) {
    console.log('🟢 [CONVERSATIONS SERVICE] Obteniendo conversación:', conversationId);

    const database = await db.connect();

    const [conversation] = await database
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation || conversation.accountId !== accountId) {
      throw new AppError(404, 'Conversación no encontrada');
    }

    return {
      success: true,
      data: {
        ...conversation,
        metadata: conversation.metadata ? JSON.parse(conversation.metadata) : null,
        createdAt: conversation.createdAt.toISOString(),
        updatedAt: conversation.updatedAt.toISOString(),
      },
    };
  }

  async create(accountId: string, input: CreateConversationInput) {
    console.log('🟢 [CONVERSATIONS SERVICE] Creando conversación');

    const database = await db.connect();

    // Verificar que el site pertenece a la cuenta
    const [site] = await database
      .select()
      .from(sites)
      .where(and(eq(sites.id, input.siteId), eq(sites.accountId, accountId)))
      .limit(1);

    if (!site) {
      throw new AppError(404, 'Sitio no encontrado');
    }

    const conversationId = `conv_${uuidv4()}`;

    await database.insert(conversations).values({
      id: conversationId,
      accountId,
      siteId: input.siteId,
      visitorId: input.visitorId || `visitor_${uuidv4()}`,
      status: 'active',
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    });

    const [newConversation] = await database
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    console.log('✅ [CONVERSATIONS SERVICE] Conversación creada:', conversationId);

    return {
      success: true,
      data: {
        ...newConversation,
        metadata: newConversation.metadata ? JSON.parse(newConversation.metadata) : null,
        createdAt: newConversation.createdAt.toISOString(),
        updatedAt: newConversation.updatedAt.toISOString(),
      },
    };
  }

  async update(conversationId: string, accountId: string, updates: { status?: string; metadata?: any }) {
    console.log('🟢 [CONVERSATIONS SERVICE] Actualizando conversación:', conversationId);

    const database = await db.connect();

    const [conversation] = await database
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation || conversation.accountId !== accountId) {
      throw new AppError(404, 'Conversación no encontrada');
    }

    await database
      .update(conversations)
      .set({
        ...(updates.status && { status: updates.status }),
        ...(updates.metadata && { metadata: JSON.stringify(updates.metadata) }),
      })
      .where(eq(conversations.id, conversationId));

    const [updated] = await database
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    console.log('✅ [CONVERSATIONS SERVICE] Conversación actualizada');

    return {
      success: true,
      data: {
        ...updated,
        metadata: updated.metadata ? JSON.parse(updated.metadata) : null,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  }

  async delete(conversationId: string, accountId: string) {
    console.log('🟢 [CONVERSATIONS SERVICE] Eliminando conversación:', conversationId);

    const database = await db.connect();

    const [conversation] = await database
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation || conversation.accountId !== accountId) {
      throw new AppError(404, 'Conversación no encontrada');
    }

    // Eliminar la conversación (los mensajes se eliminarán en cascada)
    await database
      .delete(conversations)
      .where(eq(conversations.id, conversationId));

    console.log('✅ [CONVERSATIONS SERVICE] Conversación eliminada');

    return {
      success: true,
      message: 'Conversación eliminada exitosamente',
    };
  }
}

export const conversationsService = new ConversationsService();

