import { randomUUID } from "crypto";
import { and, eq, inArray, asc } from "drizzle-orm";
import { db } from "@/db";
import { conversations, conversationMessages } from "@/db/schema";

type ConversationLookup = {
  accountId: string;
  siteId: string;
  visitorId: string;
};

export async function getOrCreateConversation({
  accountId,
  siteId,
  visitorId,
}: ConversationLookup) {
  const [existing] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.accountId, accountId),
        eq(conversations.siteId, siteId),
        eq(conversations.visitorId, visitorId),
        inArray(conversations.status, ["open", "pending"]),
      ),
    )
    .limit(1);

  if (existing) {
    return existing;
  }

  const conversationId = randomUUID();
  await db.insert(conversations).values({
    id: conversationId,
    accountId,
    siteId,
    visitorId,
    status: "open",
  });

  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  return conversation;
}

export type ConversationMessageRecord = typeof conversationMessages.$inferSelect;

export function serializeConversationMessage(record: ConversationMessageRecord) {
  const createdAt =
    record.createdAt instanceof Date ? record.createdAt.toISOString() : (record.createdAt as string | null);

  let metadata: unknown = null;
  if (record.metadataJson) {
    try {
      metadata = JSON.parse(record.metadataJson);
    } catch {
      metadata = null;
    }
  }

  return {
    id: record.id,
    senderType: record.senderType,
    senderId: record.senderId,
    content: record.content,
    intent: record.intent,
    metadata,
    createdAt,
  };
}

export async function fetchConversationMessages(conversationId: string, limit = 50) {
  return db
    .select()
    .from(conversationMessages)
    .where(eq(conversationMessages.conversationId, conversationId))
    .orderBy(asc(conversationMessages.createdAt))
    .limit(limit);
}


