import { NextRequest, NextResponse } from "next/server";
import { handleCorsOptions, withCors } from "@/lib/cors";
import { db } from "@/db";
import { sites, conversations, messages, accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { randomUUID } from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OPTIONS /api/public/chat
 * Maneja preflight CORS
 */
export async function OPTIONS() {
  return handleCorsOptions();
}

/**
 * POST /api/public/chat
 * Endpoint público para el widget embebido
 * No requiere autenticación Bearer (es público)
 * 
 * Body:
 * {
 *   "appId": "uuid",
 *   "message": "Hola",
 *   "sessionId": "uuid" (opcional),
 *   "metadata": { "url": "...", "userAgent": "..." } (opcional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appId, message, sessionId, metadata } = body;

    // Validaciones
    if (!appId || typeof appId !== "string") {
      return withCors(
        NextResponse.json(
          { error: "appId requerido", message: "Debes proporcionar un appId válido" },
          { status: 400 }
        )
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return withCors(
        NextResponse.json(
          { error: "Mensaje requerido", message: "Debes proporcionar un mensaje" },
          { status: 400 }
        )
      );
    }

    // Verificar que el sitio existe y está activo
    const [site] = await db
      .select({
        id: sites.id,
        name: sites.name,
        accountId: sites.accountId,
        widgetConfigJson: sites.widgetConfigJson,
      })
      .from(sites)
      .where(eq(sites.appId, appId))
      .limit(1);

    if (!site) {
      return withCors(
        NextResponse.json(
          { error: "Sitio no encontrado", message: "El appId proporcionado no es válido" },
          { status: 404 }
        )
      );
    }

    // Obtener información de la cuenta
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, site.accountId))
      .limit(1);

    if (!account) {
      return withCors(
        NextResponse.json(
          { error: "Cuenta no encontrada", message: "La cuenta asociada no existe" },
          { status: 404 }
        )
      );
    }

    // Verificar que OpenAI esté configurado
    if (!process.env.OPENAI_API_KEY) {
      return withCors(
        NextResponse.json(
          {
            error: "Configuración faltante",
            message: "El servidor no tiene configurada la API key de OpenAI",
          },
          { status: 500 }
        )
      );
    }

    // Buscar o crear conversación
    let conversationId = sessionId;
    let conversation;

    if (conversationId) {
      // Buscar conversación existente
      [conversation] = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, conversationId))
        .limit(1);
    }

    if (!conversation) {
      // Crear nueva conversación
      conversationId = randomUUID();
      await db.insert(conversations).values({
        id: conversationId,
        accountId: site.accountId,
        siteId: site.id,
        visitorId: null, // Por ahora no identificamos visitantes
        status: "active",
        metadata: metadata ? JSON.stringify(metadata) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Guardar mensaje del usuario
    const userMessageId = randomUUID();
    await db.insert(messages).values({
      id: userMessageId,
      conversationId: conversationId,
      role: "user",
      content: message.trim(),
      createdAt: new Date(),
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
      { role: "system" as const, content: systemPrompt },
      ...messageHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage =
      completion.choices[0]?.message?.content ||
      "Lo siento, no pude generar una respuesta.";

    // Guardar respuesta del asistente
    const assistantMessageId = randomUUID();
    await db.insert(messages).values({
      id: assistantMessageId,
      conversationId: conversationId,
      role: "assistant",
      content: assistantMessage,
      createdAt: new Date(),
    });

    // Actualizar conversación
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return withCors(
      NextResponse.json({
        success: true,
        data: {
          message: assistantMessage,
          sessionId: conversationId,
          usage: {
            promptTokens: completion.usage?.prompt_tokens,
            completionTokens: completion.usage?.completion_tokens,
            totalTokens: completion.usage?.total_tokens,
          },
        },
      })
    );
  } catch (error: any) {
    console.error("Error en chat público:", error);

    if (error?.code === "insufficient_quota") {
      return withCors(
        NextResponse.json(
          {
            error: "Cuota excedida",
            message: "La API key de OpenAI no tiene crédito disponible",
          },
          { status: 503 }
        )
      );
    }

    return withCors(
      NextResponse.json(
        { error: "Error interno", message: "No se pudo procesar el mensaje" },
        { status: 500 }
      )
    );
  }
}

