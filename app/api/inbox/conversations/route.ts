import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, conversations, visitors, conversationMessages } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const [currentUser] = await db.select().from(user).where(eq(user.id, userId)).limit(1);

    if (!currentUser?.accountId) {
      return NextResponse.json({ error: "Tu usuario no está asociado a una cuenta" }, { status: 400 });
    }

    const limitParam = Number(request.nextUrl.searchParams.get("limit"));
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(Math.floor(limitParam), 1), MAX_LIMIT)
      : DEFAULT_LIMIT;

    const conversationRows = await db
      .select({
        id: conversations.id,
        status: conversations.status,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
        assignedUserId: conversations.assignedUserId,
        visitorId: visitors.id,
        visitorName: visitors.name,
        visitorEmail: visitors.email,
      })
      .from(conversations)
      .where(eq(conversations.accountId, currentUser.accountId))
      .leftJoin(visitors, eq(conversations.visitorId, visitors.id))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(limit);

    const conversationIds = conversationRows.map((row) => row.id);
    const lastMessageMap = new Map<
      string,
      {
        content: string;
        createdAt: Date | null;
        senderType: "visitor" | "agent" | "bot";
      }
    >();

    if (conversationIds.length > 0) {
      const lastMessages = await db
        .select({
          conversationId: conversationMessages.conversationId,
          content: conversationMessages.content,
          createdAt: conversationMessages.createdAt,
          senderType: conversationMessages.senderType,
        })
        .from(conversationMessages)
        .where(inArray(conversationMessages.conversationId, conversationIds))
        .orderBy(desc(conversationMessages.createdAt))
        .limit(conversationIds.length * 3);

      for (const message of lastMessages) {
        if (!lastMessageMap.has(message.conversationId)) {
          lastMessageMap.set(message.conversationId, {
            content: message.content,
            createdAt: message.createdAt,
            senderType: message.senderType as "visitor" | "agent" | "bot",
          });
        }
      }
    }

    const payload = conversationRows.map((conversation) => {
      const lastMessage = lastMessageMap.get(conversation.id);
      return {
        id: conversation.id,
        status: conversation.status,
        lastMessageAt: conversation.lastMessageAt,
        createdAt: conversation.createdAt,
        assignedUserId: conversation.assignedUserId,
        visitor: {
          id: conversation.visitorId,
          name: conversation.visitorName,
          email: conversation.visitorEmail,
        },
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              senderType: lastMessage.senderType,
              createdAt: lastMessage.createdAt,
            }
          : null,
      };
    });

    return NextResponse.json({
      conversations: payload,
    });
  } catch (error) {
    console.error("[inbox:conversations]", error);
    return NextResponse.json(
      { error: "No pudimos cargar las conversaciones. Intenta nuevamente más tarde." },
      { status: 500 },
    );
  }
}


