import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WidgetInitDto, WidgetMessageDto } from './dto/widget.dto';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../config/database.service';
import { sites, conversations, messages, accounts } from '../../../../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { parseWidgetConfig } from '@saas-chat/core-types';

@Injectable()
export class WidgetService {
  constructor(private readonly dbService: DatabaseService) {}

  async init(siteKey: string, body: WidgetInitDto) {
    if (!siteKey) {
      throw new BadRequestException('x-site-key header is required');
    }

    const db = this.dbService.getDb();

    // Buscar site por appId (siteKey)
    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.appId, siteKey))
      .limit(1);

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    // Obtener account del site
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, site.accountId))
      .limit(1);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Generar o usar visitorId existente
    const visitorId = body.visitorId || this.generateVisitorId();

    // Parsear configuración del widget
    const widgetConfig = parseWidgetConfig(site.widgetConfigJson);

    // Buscar conversación activa para este visitorId y siteId
    const [activeConversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.siteId, site.id),
          eq(conversations.visitorId, visitorId),
          eq(conversations.status, 'active')
        )
      )
      .orderBy(desc(conversations.updatedAt))
      .limit(1);

    return {
      visitorId,
      project: {
        id: site.id,
        name: site.name,
      },
      widgetConfig,
      activeConversation: activeConversation || null,
    };
  }

  async sendMessage(siteKey: string, body: WidgetMessageDto & { pageUrl?: string; userAgent?: string }) {
    if (!siteKey) {
      throw new BadRequestException('x-site-key header is required');
    }

    if (!body.content || !body.content.trim()) {
      throw new BadRequestException('Message content is required');
    }

    const db = this.dbService.getDb();

    // Buscar site por appId
    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.appId, siteKey))
      .limit(1);

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    // Obtener account del site para usar en el prompt de OpenAI
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, site.accountId))
      .limit(1);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Buscar o crear conversación
    let conversationId = body.conversationId;

    if (!conversationId) {
      // Crear nueva conversación
      conversationId = this.generateConversationId();
      await db.insert(conversations).values({
        id: conversationId,
        accountId: site.accountId,
        siteId: site.id,
        visitorId: body.visitorId,
        status: 'active',
        metadata: JSON.stringify({
          pageUrl: body.pageUrl || '',
          userAgent: body.userAgent || '',
        }),
      });
    } else {
      // Verificar que la conversación existe y pertenece al site
      const [conversation] = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.id, conversationId),
            eq(conversations.siteId, site.id)
          )
        )
        .limit(1);

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }
    }

    // Crear mensaje del usuario
    const userMessageId = this.generateMessageId();
    await db.insert(messages).values({
      id: userMessageId,
      conversationId,
      role: 'user',
      content: body.content.trim(),
    });

    // Actualizar timestamp de la conversación
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    // Procesar con bot/IA si está configurado
    let botResponse = 'Gracias por tu mensaje. Un agente te responderá pronto.';
    let usage = null;

    // Verificar si OpenAI está configurado
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        // Obtener historial de mensajes (últimos 10)
        const messageHistory = await db
          .select({
            role: messages.role,
            content: messages.content,
          })
          .from(messages)
          .where(eq(messages.conversationId, conversationId))
          .orderBy(messages.createdAt)
          .limit(10);

        // Construir contexto para OpenAI
        const systemPrompt = `Eres un asistente inteligente de ${account.name}.
Tu objetivo es ayudar a los visitantes del sitio web "${site.name}".
Responde de manera útil, profesional y amigable.
Siempre responde en español.`;

        const chatMessages = [
          { role: 'system' as const, content: systemPrompt },
          ...messageHistory.map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
        ];

        // Llamar a OpenAI
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 500,
        });

        botResponse =
          completion.choices[0]?.message?.content ||
          'Lo siento, no pude generar una respuesta.';

        usage = {
          promptTokens: completion.usage?.prompt_tokens,
          completionTokens: completion.usage?.completion_tokens,
          totalTokens: completion.usage?.total_tokens,
        };
      } catch (error: any) {
        console.error('Error llamando a OpenAI:', error);
        if (error?.code === 'insufficient_quota') {
          botResponse = 'Lo siento, el servicio de IA no está disponible en este momento.';
        }
        // Si falla OpenAI, usar respuesta por defecto
      }
    }

    // Crear mensaje de respuesta del bot
    const botMessageId = this.generateMessageId();
    await db.insert(messages).values({
      id: botMessageId,
      conversationId,
      role: 'assistant',
      content: botResponse,
    });

    return {
      conversationId,
      message: botResponse,
      usage,
    };
  }

  async handleOfflineForm(body: any) {
    // TODO: Implementar guardado de formulario offline
    // Crear conversación con status "pending" o "offline"
    // Enviar notificación por email si está configurado

    return {
      success: true,
      message: 'Tu mensaje ha sido enviado. Te contactaremos pronto.',
    };
  }

  private generateVisitorId(): string {
    return `visitor_${uuidv4()}`;
  }

  private generateConversationId(): string {
    return `conv_${uuidv4()}`;
  }

  private generateMessageId(): string {
    return `msg_${uuidv4()}`;
  }
}

