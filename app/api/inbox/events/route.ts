import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createEventStream } from "@/lib/event-bus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    return createEventStream(`account:${currentUser.accountId}`);
  } catch (error) {
    console.error("[inbox:events]", error);
    return NextResponse.json(
      { error: "No pudimos iniciar el canal en tiempo real." },
      { status: 500 },
    );
  }
}


