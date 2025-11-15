import { db } from './db';
import { sessions, messages, type NewSession, type NewMessage } from './db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Obtener o crear sesión por IP
export async function getOrCreateSession(ipAddress: string, userAgent?: string) {
  try {
    // Buscar sesión existente activa (última actividad en las últimas 24 horas)
    const existingSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.ipAddress, ipAddress))
      .orderBy(desc(sessions.lastActivity))
      .limit(1);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (existingSessions.length > 0 && existingSessions[0].lastActivity > oneDayAgo) {
      // Actualizar última actividad
      await db
        .update(sessions)
        .set({ lastActivity: new Date() })
        .where(eq(sessions.id, existingSessions[0].id));

      return existingSessions[0];
    }

    // Crear nueva sesión
    const sessionId = uuidv4();
    const newSession: NewSession = {
      ipAddress,
      sessionId,
      userAgent: userAgent || null,
    };

    const result = await db.insert(sessions).values(newSession);
    
    // Obtener la sesión recién creada
    const [createdSession] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, Number(result[0].insertId)))
      .limit(1);

    return createdSession;
  } catch (error) {
    console.error('Error getting or creating session:', error);
    throw error;
  }
}

// Guardar mensaje en la base de datos
export async function saveMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  intent?: string
) {
  try {
    const newMessage: NewMessage = {
      sessionId,
      role,
      content,
      intent: intent || null,
    };

    await db.insert(messages).values(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

// Obtener historial de mensajes de una sesión
export async function getSessionMessages(sessionId: string, limit: number = 50) {
  try {
    const sessionMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(messages.createdAt)
      .limit(limit);

    return sessionMessages;
  } catch (error) {
    console.error('Error getting session messages:', error);
    return [];
  }
}

// Obtener todas las sesiones de una IP
export async function getSessionsByIP(ipAddress: string) {
  try {
    const ipSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.ipAddress, ipAddress))
      .orderBy(desc(sessions.lastActivity));

    return ipSessions;
  } catch (error) {
    console.error('Error getting sessions by IP:', error);
    return [];
  }
}
