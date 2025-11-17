import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { conversations } from '../db/schema.js';
import { AppError } from '../middleware/error.middleware.js';

class EndUsersService {
  async findAll(accountId: string, query: { siteId?: string; limit?: number; offset?: number }) {
    console.log('🟢 [END USERS SERVICE] Listando visitantes');

    const database = await db.connect();
    const limit = Math.min(query.limit || 50, 100); // Max 100
    const offset = query.offset || 0;

    // Construir query
    let queryBuilder = database
      .select({
        visitorId: conversations.visitorId,
        siteId: conversations.siteId,
        lastActivity: sql`MAX(${conversations.updatedAt})`.as('last_activity'),
        conversationCount: sql`COUNT(DISTINCT ${conversations.id})`.as('conversation_count'),
      })
      .from(conversations)
      .where(eq(conversations.accountId, accountId))
      .groupBy(conversations.visitorId, conversations.siteId)
      .orderBy(desc(sql`MAX(${conversations.updatedAt})`))
      .limit(limit)
      .offset(offset);

    // Filtrar por siteId si está presente
    if (query.siteId) {
      queryBuilder = database
        .select({
          visitorId: conversations.visitorId,
          siteId: conversations.siteId,
          lastActivity: sql`MAX(${conversations.updatedAt})`.as('last_activity'),
          conversationCount: sql`COUNT(DISTINCT ${conversations.id})`.as('conversation_count'),
        })
        .from(conversations)
        .where(and(eq(conversations.accountId, accountId), eq(conversations.siteId, query.siteId)))
        .groupBy(conversations.visitorId, conversations.siteId)
        .orderBy(desc(sql`MAX(${conversations.updatedAt})`))
        .limit(limit)
        .offset(offset);
    }

    const endUsers = await queryBuilder;

    console.log(`✅ [END USERS SERVICE] ${endUsers.length} visitantes encontrados`);

    return {
      data: endUsers,
      pagination: {
        limit,
        offset,
        total: endUsers.length, // En una implementación real, harías un COUNT por separado
      },
    };
  }

  async findOne(accountId: string, visitorId: string) {
    console.log('🟢 [END USERS SERVICE] Obteniendo visitante:', visitorId);

    const database = await db.connect();

    // Obtener todas las conversaciones del visitante
    const visitorConversations = await database
      .select()
      .from(conversations)
      .where(and(eq(conversations.accountId, accountId), eq(conversations.visitorId, visitorId)))
      .orderBy(desc(conversations.updatedAt));

    if (visitorConversations.length === 0) {
      throw new AppError(404, 'Visitante no encontrado');
    }

    // Calcular estadísticas
    const stats = {
      totalConversations: visitorConversations.length,
      activeConversations: visitorConversations.filter((c) => c.status === 'active').length,
      lastActivity: visitorConversations[0].updatedAt,
    };

    console.log('✅ [END USERS SERVICE] Visitante encontrado');

    return {
      visitorId,
      stats,
      conversations: visitorConversations,
    };
  }

  async update(accountId: string, visitorId: string, body: { metadata?: any }) {
    console.log('🟢 [END USERS SERVICE] Actualizando visitante:', visitorId);

    // Por ahora, solo permitimos actualizar metadata de las conversaciones
    // En una implementación real, tendrías una tabla separada para end_users

    console.log('✅ [END USERS SERVICE] Visitante actualizado');

    return {
      message: 'Actualización de visitantes por implementar',
      visitorId,
    };
  }
}

export const endUsersService = new EndUsersService();

