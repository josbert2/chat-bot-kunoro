import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { conversations, conversationMessages, user, visitors } from "@/db/schema";
import {
  fetchConversationMessages,
  serializeConversationMessage,
  ConversationMessageRecord,
} from "@/lib/conversation";
import { emitAccountEvent, emitConversationEvent } from "@/lib/socket/server";
import { eq } from "drizzle-orm";

type ConversationMessageInsert = typeof conversationMessages.$inferInsert;

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = params.conversationId;
    if (!conversationId) {
      return NextResponse.json({ error: "Falta el ID de la conversación" }, { status: 400 });
    }

    const userId = session.user.id as string;
    const [currentUser] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
    if (!currentUser?.accountId) {
      return NextResponse.json({ error: "Tu usuario no está asociado a una cuenta" }, { status: 400 });
    }

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation || conversation.accountId !== currentUser.accountId) {
      return NextResponse.json({ error: "Conversación no encontrada" }, { status: 404 });
    }

    const [visitor] = await db.select().from(visitors).where(eq(visitors.id, conversation.visitorId)).limit(1);
    const messages = await fetchConversationMessages(conversation.id, 200);

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        status: conversation.status,
        lastMessageAt: conversation.lastMessageAt,
        assignedUserId: conversation.assignedUserId,
        visitor: visitor
          ? {
              id: visitor.id,
              name: visitor.name,
              email: visitor.email,
            }
          : null,
      },
      messages: messages.map(serializeConversationMessage),
    });
  } catch (error) {
    console.error("[inbox:messages:get]", error);
    return NextResponse.json(
      { error: "No pudimos cargar los mensajes de la conversación." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = params.conversationId;
    if (!conversationId) {
      return NextResponse.json({ error: "Falta el ID de la conversación" }, { status: 400 });
    }

    const { message, status }: { message?: string; status?: string } = await request.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Escribe un mensaje para responder" }, { status: 400 });
    }

    const userId = session.user.id as string;
    const [currentUser] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
    if (!currentUser?.accountId) {
      return NextResponse.json({ error: "Tu usuario no está asociado a una cuenta" }, { status: 400 });
    }

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation || conversation.accountId !== currentUser.accountId) {
      return NextResponse.json({ error: "Conversación no encontrada" }, { status: 404 });
    }

    const trimmedMessage = message.trim();

    const agentMessage: ConversationMessageInsert = {
      id: randomUUID(),
      conversationId: conversation.id,
      accountId: conversation.accountId,
      siteId: conversation.siteId,
      visitorId: conversation.visitorId,
      senderType: "agent",
      senderId: currentUser.id,
      content: trimmedMessage,
      metadataJson: null,
      createdAt: new Date(),
    };

    await db.insert(conversationMessages).values(agentMessage);

    await db
      .update(conversations)
      .set({
        lastMessageAt: new Date(),
        status: status && ["open", "pending", "closed"].includes(status) ? (status as any) : conversation.status,
        assignedUserId: conversation.assignedUserId ?? currentUser.id,
      })
      .where(eq(conversations.id, conversation.id));

    const messages = await fetchConversationMessages(conversation.id, 200);

    const agentMessagePayload = serializeConversationMessage(agentMessage as ConversationMessageRecord);
    emitConversationEvent(conversation.id, { type: "message:new", message: agentMessagePayload });
    emitConversationEvent(conversation.id, { type: "conversation:updated", conversationId: conversation.id });
    emitAccountEvent(conversation.accountId, { type: "conversation:updated", conversationId: conversation.id });

    return NextResponse.json({
      ok: true,
      conversation: {
        id: conversation.id,
        status: status && ["open", "pending", "closed"].includes(status) ? status : conversation.status,
        lastMessageAt: new Date(),
        assignedUserId: conversation.assignedUserId ?? currentUser.id,
      },
      messages: messages.map(serializeConversationMessage),
    });
  } catch (error) {
    console.error("[inbox:messages:post]", error);
    return NextResponse.json(
      { error: "No pudimos enviar tu respuesta. Intenta nuevamente." },
      { status: 500 },
    );
  }
}


