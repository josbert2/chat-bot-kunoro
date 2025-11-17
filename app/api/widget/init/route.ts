import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { sites, visitors } from "@/db/schema";
import {
  fetchConversationMessages,
  getOrCreateConversation,
  serializeConversationMessage,
} from "@/lib/conversation";

const DEFAULT_HISTORY_LIMIT = 50;

type VisitorPayload = {
  name?: string;
  email?: string;
  externalId?: string;
};

type VisitorRecord = typeof visitors.$inferSelect;
function generateSessionToken() {
  return `vis_${randomUUID().replace(/-/g, "")}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appId, sessionToken, visitor }: { appId?: string; sessionToken?: string; visitor?: VisitorPayload } = body ?? {};

    if (!appId || typeof appId !== "string") {
      return NextResponse.json({ error: "Falta el appId" }, { status: 400 });
    }

    const site = await db.query.sites.findFirst({
      where: eq(sites.appId, appId),
    });

    if (!site) {
      return NextResponse.json({ error: "Sitio no encontrado" }, { status: 404 });
    }

    let visitorRecord: VisitorRecord | undefined;

    if (sessionToken && typeof sessionToken === "string") {
      visitorRecord = await db.query.visitors.findFirst({
        where: and(eq(visitors.sessionToken, sessionToken), eq(visitors.siteId, site.id)),
      });
    }

    if (!visitorRecord) {
      const newVisitorId = randomUUID();
      const token = sessionToken && sessionToken.length > 0 ? sessionToken : generateSessionToken();

      try {
        await db.insert(visitors).values({
          id: newVisitorId,
          accountId: site.accountId,
          siteId: site.id,
          sessionToken: token,
          name: visitor?.name,
          email: visitor?.email,
          externalId: visitor?.externalId,
        });

        visitorRecord = await db.query.visitors.findFirst({
          where: eq(visitors.id, newVisitorId),
        });
      } catch (error: any) {
        if (error?.code === "ER_DUP_ENTRY") {
          visitorRecord = await db.query.visitors.findFirst({
            where: and(eq(visitors.sessionToken, token), eq(visitors.siteId, site.id)),
          });
        } else {
          throw error;
        }
      }
    } else {
      const updateFields: Record<string, any> = { lastSeenAt: new Date() };

      if (visitor?.name) {
        updateFields.name = visitor.name;
      }
      if (visitor?.email) {
        updateFields.email = visitor.email;
      }
      if (visitor?.externalId) {
        updateFields.externalId = visitor.externalId;
      }

      await db.update(visitors).set(updateFields).where(eq(visitors.id, visitorRecord.id));

      visitorRecord = {
        ...visitorRecord,
        ...updateFields,
      };
    }

    if (!visitorRecord) {
      return NextResponse.json({ error: "No se pudo inicializar el visitante" }, { status: 500 });
    }

    const conversation = await getOrCreateConversation({
      accountId: site.accountId,
      siteId: site.id,
      visitorId: visitorRecord.id,
    });

    const history = await fetchConversationMessages(conversation.id, DEFAULT_HISTORY_LIMIT);

    return NextResponse.json({
      sessionToken: visitorRecord.sessionToken,
      visitor: {
        id: visitorRecord.id,
        name: visitorRecord.name,
        email: visitorRecord.email,
        externalId: visitorRecord.externalId,
      },
      conversation: {
        id: conversation.id,
        status: conversation.status,
        lastMessageAt: conversation.lastMessageAt,
      },
      site: {
        id: site.id,
        name: site.name,
        appId: site.appId,
      },
      messages: history.map(serializeConversationMessage),
    });
  } catch (error) {
    console.error("[widget:init]", error);
    return NextResponse.json(
      { error: "No pudimos iniciar el widget. Intenta nuevamente más tarde." },
      { status: 500 },
    );
  }
}


