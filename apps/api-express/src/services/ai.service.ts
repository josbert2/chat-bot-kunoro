import { eq } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { conversations, messages, sites, accounts } from '../db/schema.js';
import { AppError } from '../middleware/error.middleware.js';

class AiService {
  async suggestReply(accountId: string, conversationId: string, lastMessage: string) {
    console.log('🟢 [AI SERVICE] Generando sugerencia de respuesta');

    if (!process.env.OPENAI_API_KEY) {
      throw new AppError(503, 'OpenAI no está configurado');
    }

    const database = await db.connect();

    // Verificar que la conversación pertenezca al account
    const [conversation] = await database
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation) {
      throw new AppError(404, 'Conversación no encontrada');
    }

    if (conversation.accountId !== accountId) {
      throw new AppError(403, 'No tienes acceso a esta conversación');
    }

    // Obtener contexto de la conversación
    const [site] = await database
      .select()
      .from(sites)
      .where(eq(sites.id, conversation.siteId))
      .limit(1);

    const [account] = await database
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);

    // Obtener historial de mensajes (últimos 10)
    const messageHistory = await database
      .select({
        role: messages.role,
        content: messages.content,
      })
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt)
      .limit(10);

    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const systemPrompt = `Eres un agente de soporte inteligente para ${account?.name || 'la empresa'}.
Tu objetivo es sugerir respuestas útiles, profesionales y empáticas para los agentes humanos.
El sitio es: ${site?.name || 'desconocido'}.
Genera una sugerencia de respuesta que sea clara, concisa y útil.
Siempre responde en español.`;

      const chatMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messageHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ];

      console.log('🤖 [AI SERVICE] Llamando a OpenAI para sugerencia...');

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 300,
      });

      const suggestedReply =
        completion.choices[0]?.message?.content || 'No se pudo generar una sugerencia.';

      const usage = {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
        totalTokens: completion.usage?.total_tokens,
      };

      console.log('✅ [AI SERVICE] Sugerencia generada');

      return {
        suggestedReply,
        usage,
      };
    } catch (error: any) {
      console.error('❌ [AI SERVICE] Error llamando a OpenAI:', error.message);
      throw new AppError(500, 'Error al generar sugerencia de respuesta');
    }
  }
}

export const aiService = new AiService();

