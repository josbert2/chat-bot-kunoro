import { v4 as uuidv4 } from 'uuid';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { sites, conversations, messages, accounts } from '../db/schema.js';
import { AppError } from '../middleware/error.middleware.js';
import { parseWidgetConfig } from '../utils/widget-config.js';
import { io } from '../index.js';

interface WidgetInitInput {
  visitorId?: string;
}

interface WidgetMessageInput {
  visitorId: string;
  conversationId?: string;
  content: string;
  pageUrl?: string;
  userAgent?: string;
}

class WidgetService {
  async init(siteKey: string, body: WidgetInitInput) {
    console.log('🟢 [WIDGET SERVICE] Inicializando widget para site:', siteKey);

    const database = await db.connect();

    // Buscar site por appId (siteKey)
    const [site] = await database
      .select()
      .from(sites)
      .where(eq(sites.appId, siteKey))
      .limit(1);

    if (!site) {
      throw new AppError(404, 'Sitio no encontrado');
    }

    // Obtener account del site
    const [account] = await database
      .select()
      .from(accounts)
      .where(eq(accounts.id, site.accountId))
      .limit(1);

    if (!account) {
      throw new AppError(404, 'Cuenta no encontrada');
    }

    // Generar o usar visitorId existente
    const visitorId = body.visitorId || `visitor_${uuidv4()}`;

    // Parsear configuración del widget
    const widgetConfig = parseWidgetConfig(site.widgetConfigJson);

    // Buscar conversación activa para este visitorId y siteId (unassigned u open)
    const [activeConversation] = await database
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.siteId, site.id),
          eq(conversations.visitorId, visitorId)
        )
      )
      .orderBy(desc(conversations.updatedAt))
      .limit(1);

    console.log('✅ [WIDGET SERVICE] Widget inicializado');

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

  async sendMessage(siteKey: string, body: WidgetMessageInput) {
    console.log('🟢 [WIDGET SERVICE] Enviando mensaje al widget');

    if (!body.content || !body.content.trim()) {
      throw new AppError(400, 'El contenido del mensaje es requerido');
    }

    const database = await db.connect();

    // Buscar site por appId
    const [site] = await database
      .select()
      .from(sites)
      .where(eq(sites.appId, siteKey))
      .limit(1);

    if (!site) {
      throw new AppError(404, 'Sitio no encontrado');
    }

    // Obtener account del site
    const [account] = await database
      .select()
      .from(accounts)
      .where(eq(accounts.id, site.accountId))
      .limit(1);

    if (!account) {
      throw new AppError(404, 'Cuenta no encontrada');
    }

    // Buscar o crear conversación
    let conversationId = body.conversationId;

    if (!conversationId) {
      // Crear nueva conversación
      conversationId = `conv_${uuidv4()}`;
      const now = new Date();
      
      const metadata = {
        pageUrl: body.pageUrl || '',
        userAgent: body.userAgent || '',
        name: `Visitante ${body.visitorId.substring(0, 8)}`,
      };
      
      await database.insert(conversations).values({
        id: conversationId,
        accountId: site.accountId,
        siteId: site.id,
        visitorId: body.visitorId,
        status: 'unassigned', // Cambiar a 'unassigned' para que aparezca en el inbox
        metadata: JSON.stringify(metadata),
        createdAt: now,
        updatedAt: now,
      });
      
      console.log('🟢 [WIDGET SERVICE] Nueva conversación creada:', conversationId);
      
      // Emitir evento Socket.IO para que aparezca en tiempo real en el inbox
      io.emit('new_conversation', {
        id: conversationId,
        endUserId: body.visitorId,
        endUserName: metadata.name,
        lastMessage: body.content,
        lastMessageAt: now,
        unread: true,
        status: 'unassigned',
      });
      
      console.log('📡 [WIDGET SERVICE] Evento new_conversation emitido');
    } else {
      // Verificar que la conversación existe y pertenece al site
      const [conversation] = await database
        .select()
        .from(conversations)
        .where(
          and(eq(conversations.id, conversationId), eq(conversations.siteId, site.id))
        )
        .limit(1);

      if (!conversation) {
        throw new AppError(404, 'Conversación no encontrada');
      }
    }

    // Crear mensaje del usuario
    const userMessageId = `msg_${uuidv4()}`;
    const now = new Date();
    
    await database.insert(messages).values({
      id: userMessageId,
      conversationId,
      role: 'user',
      content: body.content.trim(),
      createdAt: now,
    });

    // Actualizar timestamp de la conversación
    await database
      .update(conversations)
      .set({ updatedAt: now })
      .where(eq(conversations.id, conversationId));
    
    // Emitir evento Socket.IO para que aparezca en tiempo real
    io.emit('new_message', {
      conversationId,
      message: {
        id: userMessageId,
        content: body.content.trim(),
        sender: 'user',
        timestamp: now,
      },
    });
    
    console.log('📡 [WIDGET SERVICE] Evento new_message emitido para conversación:', conversationId);

    // Procesar con bot/IA si está configurado
    let botResponse = 'Gracias por tu mensaje. Un agente te responderá pronto.';
    let usage = null;

    // Verificar si OpenAI está configurado
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log('🤖 [WIDGET SERVICE] Llamando a OpenAI...');
        
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

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

        console.log('✅ [WIDGET SERVICE] Respuesta de OpenAI generada');
      } catch (error: any) {
        console.error('❌ [WIDGET SERVICE] Error llamando a OpenAI:', error.message);
        if (error?.code === 'insufficient_quota') {
          botResponse = 'Lo siento, el servicio de IA no está disponible en este momento.';
        }
      }
    }

    // Crear mensaje de respuesta del bot
    const botMessageId = `msg_${uuidv4()}`;
    await database.insert(messages).values({
      id: botMessageId,
      conversationId,
      role: 'assistant',
      content: botResponse,
    });

    console.log('✅ [WIDGET SERVICE] Mensaje enviado y respuesta generada');

    return {
      conversationId,
      message: botResponse,
      usage,
    };
  }

  async handleOfflineForm(body: { name: string; email: string; message: string }) {
    console.log('🟢 [WIDGET SERVICE] Formulario offline recibido');

    // TODO: Guardar en base de datos y enviar notificación
    // Por ahora solo retornamos success

    return {
      success: true,
      message: 'Tu mensaje ha sido enviado. Te contactaremos pronto.',
    };
  }
}

export const widgetService = new WidgetService();

