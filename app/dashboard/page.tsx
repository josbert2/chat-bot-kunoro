import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, conversations, visitors, conversationMessages } from "@/db/schema";
import { fetchConversationMessages, serializeConversationMessage } from "@/lib/conversation";
import { InboxView } from "@/components/InboxView";

type ConversationPayload = {
  id: string;
  status: "open" | "pending" | "closed";
  lastMessageAt?: string | null;
  createdAt?: string | null;
  assignedUserId?: string | null;
  visitor: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
  lastMessage: {
    content: string;
    senderType: "visitor" | "agent" | "bot";
    createdAt?: string | null;
  } | null;
};

export default async function DashboardHome() {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id as string;
  const [currentUser] = await db.select().from(user).where(eq(user.id, userId)).limit(1);

  let initialConversations: ConversationPayload[] = [];
  let initialMessages: ReturnType<typeof serializeConversationMessage>[] = [];
  let initialSelectedConversationId: string | undefined = undefined;

  if (currentUser?.accountId) {
    const rows = await db
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
      .leftJoin(visitors, eq(conversations.visitorId, visitors.id))
      .where(eq(conversations.accountId, currentUser.accountId))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(20);

    const conversationIds = rows.map((row) => row.id);
    const lastMessageMap = new Map<
      string,
      { content: string; senderType: "visitor" | "agent" | "bot"; createdAt: Date | null }
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
            senderType: message.senderType as "visitor" | "agent" | "bot",
            createdAt: message.createdAt,
          });
        }
      }
    }

    initialConversations = rows.map((row) => {
      const lastMessage = lastMessageMap.get(row.id);
      return {
        id: row.id,
        status: row.status as "open" | "pending" | "closed",
        lastMessageAt: row.lastMessageAt instanceof Date ? row.lastMessageAt.toISOString() : row.lastMessageAt,
        createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
        assignedUserId: row.assignedUserId,
        visitor: {
          id: row.visitorId,
          name: row.visitorName,
          email: row.visitorEmail,
        },
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              senderType: lastMessage.senderType,
              createdAt: lastMessage.createdAt instanceof Date ? lastMessage.createdAt.toISOString() : lastMessage.createdAt,
            }
          : null,
      };
    });

    if (initialConversations.length > 0) {
      initialSelectedConversationId = initialConversations[0].id;
      const initialHistory = await fetchConversationMessages(initialSelectedConversationId, 200);
      initialMessages = initialHistory.map(serializeConversationMessage);
    }
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Inbox</h3>
          <p className="text-xs text-slate-400 mt-1">
            Conversaciones en vivo entre tu widget y el panel de agentes.
          </p>
        </div>
      </div>

      <InboxView
        workspaceId={currentUser?.accountId ?? null}
        initialConversations={initialConversations}
        initialSelectedConversationId={initialSelectedConversationId}
        initialMessages={initialMessages}
      />
    </div>
  );
}
