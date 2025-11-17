import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { conversations, visitors } from "@/db/schema";
import { createEventStream } from "@/lib/event-bus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } },
) {
  try {
    const sessionToken = request.nextUrl.searchParams.get("sessionToken");
    const conversationId = params.conversationId;

    if (!conversationId) {
      return NextResponse.json({ error: "Falta el ID de la conversación" }, { status: 400 });
    }

    if (!sessionToken) {
      return NextResponse.json({ error: "Falta el token de sesión" }, { status: 400 });
    }

    const [record] = await db
      .select({
        conversationId: conversations.id,
        accountId: conversations.accountId,
        siteId: conversations.siteId,
        visitorId: visitors.id,
        visitorSessionToken: visitors.sessionToken,
      })
      .from(conversations)
      .innerJoin(visitors, eq(conversations.visitorId, visitors.id))
      .where(
        and(eq(conversations.id, conversationId), eq(visitors.sessionToken, sessionToken)),
      )
      .limit(1);

    if (!record) {
      return NextResponse.json({ error: "No autorizado para esta conversación" }, { status: 403 });
    }

    return createEventStream(`conversation:${conversationId}`);
  } catch (error) {
    console.error("[widget:events]", error);
    return NextResponse.json(
      { error: "No pudimos abrir el canal en tiempo real." },
      { status: 500 },
    );
  }
}


