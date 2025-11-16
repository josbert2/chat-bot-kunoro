import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { conversations, messages } from '../db/schema.js';

interface DateRange {
  from?: string; // ISO date
  to?: string; // ISO date
}

class AnalyticsService {
  async getSummary(accountId: string, query: DateRange & { siteId?: string }) {
    console.log('🟢 [ANALYTICS SERVICE] Obteniendo resumen');

    const database = await db.connect();

    const now = new Date();
    const from = query.from ? new Date(query.from) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 días atrás
    const to = query.to ? new Date(query.to) : now;

    // Construir where clause
    let whereClause = and(
      eq(conversations.accountId, accountId),
      gte(conversations.createdAt, from),
      lte(conversations.createdAt, to)
    );

    if (query.siteId) {
      whereClause = and(whereClause, eq(conversations.siteId, query.siteId));
    }

    // Total de conversaciones
    const totalConversationsResult = await database
      .select({ count: sql`COUNT(*)`.as('count') })
      .from(conversations)
      .where(whereClause);

    const totalConversations = Number(totalConversationsResult[0]?.count || 0);

    // Conversaciones activas
    const activeConversationsResult = await database
      .select({ count: sql`COUNT(*)`.as('count') })
      .from(conversations)
      .where(and(whereClause, eq(conversations.status, 'active')));

    const activeConversations = Number(activeConversationsResult[0]?.count || 0);

    // Total de mensajes (aproximado, de todas las conversaciones del período)
    const conversationIds = await database
      .select({ id: conversations.id })
      .from(conversations)
      .where(whereClause);

    let totalMessages = 0;
    if (conversationIds.length > 0) {
      const ids = conversationIds.map((c) => c.id);
      // Para evitar query muy largo, limitamos a 100 conversations
      const limitedIds = ids.slice(0, 100);

      const messagesResult = await database
        .select({ count: sql`COUNT(*)`.as('count') })
        .from(messages)
        .where(sql`${messages.conversationId} IN (${sql.join(limitedIds.map(id => sql`${id}`), sql`, `)})`);

      totalMessages = Number(messagesResult[0]?.count || 0);
    }

    // Visitantes únicos (visitorId únicos)
    const uniqueVisitorsResult = await database
      .select({ count: sql`COUNT(DISTINCT ${conversations.visitorId})`.as('count') })
      .from(conversations)
      .where(whereClause);

    const uniqueVisitors = Number(uniqueVisitorsResult[0]?.count || 0);

    console.log('✅ [ANALYTICS SERVICE] Resumen generado');

    return {
      period: { from: from.toISOString(), to: to.toISOString() },
      summary: {
        totalConversations,
        activeConversations,
        totalMessages,
        uniqueVisitors,
        avgMessagesPerConversation:
          totalConversations > 0 ? (totalMessages / totalConversations).toFixed(2) : 0,
      },
    };
  }

  async getConversationsPerDay(accountId: string, query: DateRange & { siteId?: string }) {
    console.log('🟢 [ANALYTICS SERVICE] Obteniendo conversaciones por día');

    const database = await db.connect();

    const now = new Date();
    const from = query.from ? new Date(query.from) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const to = query.to ? new Date(query.to) : now;

    // Construir where clause
    let whereClause = and(
      eq(conversations.accountId, accountId),
      gte(conversations.createdAt, from),
      lte(conversations.createdAt, to)
    );

    if (query.siteId) {
      whereClause = and(whereClause, eq(conversations.siteId, query.siteId));
    }

    // Agrupar por fecha
    const conversationsPerDay = await database
      .select({
        date: sql`DATE(${conversations.createdAt})`.as('date'),
        count: sql`COUNT(*)`.as('count'),
      })
      .from(conversations)
      .where(whereClause)
      .groupBy(sql`DATE(${conversations.createdAt})`)
      .orderBy(sql`DATE(${conversations.createdAt})`);

    console.log('✅ [ANALYTICS SERVICE] Conversaciones por día generadas');

    return {
      period: { from: from.toISOString(), to: to.toISOString() },
      data: conversationsPerDay.map((row: any) => ({
        date: row.date,
        count: Number(row.count),
      })),
    };
  }

  async getAgentsPerformance(accountId: string, query: DateRange & { siteId?: string }) {
    console.log('🟢 [ANALYTICS SERVICE] Obteniendo performance de agentes');

    // Por ahora, los "agentes" son bots (role: 'assistant')
    // En el futuro, esto podría incluir agentes humanos con IDs específicos

    const database = await db.connect();

    const now = new Date();
    const from = query.from ? new Date(query.from) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const to = query.to ? new Date(query.to) : now;

    // Construir where clause para conversaciones
    let whereClause = and(
      eq(conversations.accountId, accountId),
      gte(conversations.createdAt, from),
      lte(conversations.createdAt, to)
    );

    if (query.siteId) {
      whereClause = and(whereClause, eq(conversations.siteId, query.siteId));
    }

    // Obtener IDs de conversaciones en el período
    const conversationIds = await database
      .select({ id: conversations.id })
      .from(conversations)
      .where(whereClause)
      .limit(100); // Limitar para performance

    let agentMessages = 0;
    if (conversationIds.length > 0) {
      const ids = conversationIds.map((c) => c.id);

      const agentMessagesResult = await database
        .select({ count: sql`COUNT(*)`.as('count') })
        .from(messages)
        .where(
          and(
            sql`${messages.conversationId} IN (${sql.join(ids.map(id => sql`${id}`), sql`, `)})`,
            eq(messages.role, 'assistant')
          )
        );

      agentMessages = Number(agentMessagesResult[0]?.count || 0);
    }

    console.log('✅ [ANALYTICS SERVICE] Performance de agentes generada');

    return {
      period: { from: from.toISOString(), to: to.toISOString() },
      data: [
        {
          agent: 'Bot IA (GPT-3.5)',
          messagesCount: agentMessages,
          conversationsHandled: conversationIds.length,
        },
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();

