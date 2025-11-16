import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../index.js';
import { db } from '../db/connection.js';
import { conversations, messages, sites } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const fakeNames = [
  'María González', 'Juan Pérez', 'Ana Martínez', 'Carlos López',
  'Laura Rodríguez', 'Miguel Torres', 'Elena Sánchez', 'David Ramírez',
  'Sofia Castro', 'Pedro Vargas'
];

const fakeMessages = [
  '¡Hola! Tengo una pregunta sobre sus productos',
  'Me gustaría más información sobre sus servicios',
  '¿Podrían ayudarme con mi pedido?',
  'Necesito soporte técnico',
  'Estoy interesado en contratar sus servicios',
  '¿Cuál es el precio del plan premium?',
  'Tengo un problema con mi cuenta',
  '¿Cuándo estará disponible X función?',
  'Me pueden enviar más detalles por favor',
  '¿Tienen atención en español?'
];

export async function simulateConversation(req: Request, res: Response) {
  try {
    const accountId = (req as any).user?.accountId;
    
    if (!accountId) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const drizzleDb = db.getDb();

    // Obtener el primer site de la cuenta
    const [site] = await drizzleDb
      .select()
      .from(sites)
      .where(eq(sites.accountId, accountId))
      .limit(1);

    if (!site) {
      return res.status(404).json({ error: 'No se encontró ningún sitio' });
    }

    // Generar datos del visitante falso
    const fakeName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const fakeEmail = `${fakeName.toLowerCase().replace(' ', '.')}@example.com`;
    const visitorId = `visitor_${uuidv4()}`;
    
    // Metadata del visitante
    const visitorMetadata = JSON.stringify({
      name: fakeName,
      email: fakeEmail,
      userAgent: 'Simulator',
      url: 'https://example.com',
      ip: '127.0.0.1',
    });

    // Crear conversación
    const conversationId = uuidv4();
    await drizzleDb.insert(conversations).values({
      id: conversationId,
      accountId,
      siteId: site.id,
      visitorId,
      status: 'unassigned',
      metadata: visitorMetadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Crear mensaje inicial
    const fakeMessage = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
    const messageId = uuidv4();
    
    await drizzleDb.insert(messages).values({
      id: messageId,
      conversationId: conversationId,
      content: fakeMessage,
      role: 'user',
      createdAt: new Date(),
    });

    // Emitir evento via Socket.IO
    const now = new Date();
    io.emit('new_conversation', {
      id: conversationId,
      endUserId: visitorId,
      endUserName: fakeName,
      lastMessage: fakeMessage,
      lastMessageAt: now,
      unread: true,
      status: 'unassigned',
    });

    console.log('✅ [SIMULATOR] Nueva conversación simulada:', conversationId);

    res.json({
      success: true,
      conversation: {
        id: conversationId,
        visitorId,
        visitorName: fakeName,
        lastMessage: fakeMessage,
        status: 'unassigned',
      },
    });
  } catch (error) {
    console.error('❌ [SIMULATOR] Error:', error);
    res.status(500).json({ error: 'Error al simular conversación' });
  }
}

export async function simulateMessage(req: Request, res: Response) {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    
    if (!conversationId) {
      return res.status(400).json({ error: 'ID de conversación requerido' });
    }

    const drizzleDb = db.getDb();

    // Verificar que la conversación existe
    const [conversation] = await drizzleDb
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    // Crear mensaje
    const messageContent = content || fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
    const messageId = uuidv4();
    const now = new Date();
    
    await drizzleDb.insert(messages).values({
      id: messageId,
      conversationId,
      content: messageContent,
      role: 'user',
      createdAt: now,
    });

    // Actualizar conversación
    await drizzleDb.update(conversations)
      .set({ updatedAt: now })
      .where(eq(conversations.id, conversationId));

    // Emitir evento via Socket.IO
    io.emit('new_message', {
      conversationId,
      message: {
        id: messageId,
        content: messageContent,
        sender: 'user',
        timestamp: now,
      },
    });

    console.log('✅ [SIMULATOR] Nuevo mensaje simulado en:', conversationId);

    res.json({
      success: true,
      message: {
        id: messageId,
        content: messageContent,
        role: 'user',
        createdAt: now,
      },
    });
  } catch (error) {
    console.error('❌ [SIMULATOR] Error:', error);
    res.status(500).json({ error: 'Error al simular mensaje' });
  }
}

