import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { chatLogs, conversations, conversationMessages, sites, visitors } from "@/db/schema";
import {
  fetchConversationMessages,
  getOrCreateConversation,
  serializeConversationMessage,
  ConversationMessageRecord,
} from "@/lib/conversation";
import { classifyIntent, getSystemPrompt } from "@/lib/chat-intent";
import { openaiClient } from "@/lib/openai-client";
import { emitAccountEvent, emitConversationEvent } from "@/lib/socket/server";

const MAX_CONTEXT_MESSAGES = 12;
const DEFAULT_HISTORY_LIMIT = 50;

type ConversationMessageInsert = typeof conversationMessages.$inferInsert;

function toOpenAIRole(senderType: "visitor" | "agent" | "bot") {
  if (senderType === "visitor") return "user" as const;
  return "assistant" as const;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appId, sessionToken, message }: { appId?: string; sessionToken?: string; message?: string } = body ?? {};

    if (!appId || !sessionToken || !message?.trim()) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const [site] = await db.select().from(sites).where(eq(sites.appId, appId)).limit(1);
    if (!site) {
      return NextResponse.json({ error: "Sitio no encontrado" }, { status: 404 });
    }

    const [visitor] = await db
      .select()
      .from(visitors)
      .where(and(eq(visitors.sessionToken, sessionToken), eq(visitors.siteId, site.id)))
      .limit(1);

    if (!visitor) {
      return NextResponse.json({ error: "Sesión de visitante expirada. Reinicia el chat." }, { status: 404 });
    }

    const trimmedMessage = message.trim();

    await db.update(visitors).set({ lastSeenAt: new Date() }).where(eq(visitors.id, visitor.id));

    const conversation = await getOrCreateConversation({
      accountId: site.accountId,
      siteId: site.id,
      visitorId: visitor.id,
    });

    const intent = classifyIntent(trimmedMessage);

    const visitorMessageId = randomUUID();
    const visitorMessage: ConversationMessageInsert = {
      id: visitorMessageId,
      conversationId: conversation.id,
      accountId: site.accountId,
      siteId: site.id,
      visitorId: visitor.id,
      senderType: "visitor",
      senderId: visitor.id,
      content: trimmedMessage,
      intent,
      metadataJson: null,
      createdAt: new Date(),
    } as const;

    await db.insert(conversationMessages).values(visitorMessage);

    const contextMessages = await fetchConversationMessages(conversation.id, MAX_CONTEXT_MESSAGES * 2);
    const context = contextMessages.slice(-MAX_CONTEXT_MESSAGES);
    const openai = openaiClient;
    let assistantMessage =
      "En este momento no puedo conectarme con la IA, pero he registrado tu mensaje para que un agente te ayude cuanto antes.";
    let usage = undefined;

    if (openai && process.env.OPENAI_API_KEY) {
      const systemPrompt = getSystemPrompt(intent);
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt },
          ...context.map((msg) => ({
            role: toOpenAIRole(msg.senderType as "visitor" | "agent" | "bot"),
            content: msg.content,
          })),
        ],
      });

      assistantMessage =
        completion.choices[0]?.message?.content ||
        "Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo.";
      usage = completion.usage;
    }

    const botMessageId = randomUUID();
    const botMessage: ConversationMessageInsert = {
      id: botMessageId,
      conversationId: conversation.id,
      accountId: site.accountId,
      siteId: site.id,
      visitorId: visitor.id,
      senderType: "bot",
      senderId: conversation.id,
      content: assistantMessage,
      intent,
      metadataJson: null,
      createdAt: new Date(),
    } as const;

    await db.insert(conversationMessages).values(botMessage);

    await db
      .update(conversations)
      .set({
        lastMessageAt: new Date(),
      })
      .where(eq(conversations.id, conversation.id));

    const chatLogId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await db.insert(chatLogs).values({
      id: chatLogId,
      intent,
      userMessage: trimmedMessage,
      assistantMessage,
    });

    const latestMessages = await fetchConversationMessages(conversation.id, DEFAULT_HISTORY_LIMIT);

    const visitorMessagePayload = serializeConversationMessage(visitorMessage as ConversationMessageRecord);
    const botMessagePayload = serializeConversationMessage(botMessage as ConversationMessageRecord);

    emitConversationEvent(conversation.id, { type: "message:new", message: visitorMessagePayload });
    emitConversationEvent(conversation.id, { type: "message:new", message: botMessagePayload });
    emitConversationEvent(conversation.id, { type: "conversation:updated", conversationId: conversation.id });
    emitAccountEvent(site.accountId, { type: "conversation:updated", conversationId: conversation.id });

    return NextResponse.json({
      message: assistantMessage,
      intent,
      conversation: {
        id: conversation.id,
        status: conversation.status,
        lastMessageAt: new Date().toISOString(),
      },
      messages: latestMessages.map(serializeConversationMessage),
      usage,
    });
  } catch (error) {
    console.error("[widget:message]", error);
    return NextResponse.json(
      { error: "No pudimos procesar el mensaje. Intenta nuevamente en unos minutos." },
      { status: 500 },
    );
  }
}


