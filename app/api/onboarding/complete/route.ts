import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { accounts, user, sites } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const session = await auth.api.getSession({ headers: headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = cookies();
  const raw = cookieStore.get("kunoro_user")?.value;

  if (!raw) {
    return NextResponse.json({ error: "Onboarding data not found" }, { status: 400 });
  }

  let data: any;
  try {
    data = JSON.parse(decodeURIComponent(raw));
  } catch {
    return NextResponse.json({ error: "Invalid onboarding data" }, { status: 400 });
  }

  const userId = session.user.id as string;

  const [existingUser] = await db.select().from(user).where(eq(user.id, userId));

  if (!existingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let accountId = existingUser.accountId as string | null;
  let isNewAccount = false;

  if (!accountId) {
    accountId = randomUUID();
    isNewAccount = true;

    await db.insert(accounts).values({
      id: accountId,
      name: existingUser.name ?? "Mi primera cuenta",
      plan: "free",
      businessModel: data.businessModel,
      industry: data.industry,
      conversationsRange: data.conversationsRange,
      visitorsRange: data.visitorsRange,
      platform: data.platform,
      agentCount: data.agentCount,
      goalId: data.goalId,
      useAi: typeof data.useAi === "boolean" ? data.useAi : null,
    });

    await db
      .update(user)
      .set({ accountId })
      .where(eq(user.id, userId));
  } else {
    await db
      .update(accounts)
      .set({
        businessModel: data.businessModel,
        industry: data.industry,
        conversationsRange: data.conversationsRange,
        visitorsRange: data.visitorsRange,
        platform: data.platform,
        agentCount: data.agentCount,
        goalId: data.goalId,
        useAi: typeof data.useAi === "boolean" ? data.useAi : null,
      })
      .where(eq(accounts.id, accountId));
  }

  // Crear un sitio por defecto si es una cuenta nueva o si no tiene sitios
  const existingSite = await db.query.sites.findFirst({
    where: eq(sites.accountId, accountId),
  });

  if (!existingSite) {
    const siteId = randomUUID();
    const appId = `app_${randomUUID().replace(/-/g, "")}`;
    const accountName = existingUser.name ?? "Mi sitio";

    await db.insert(sites).values({
      id: siteId,
      accountId,
      name: `${accountName} - Sitio Principal`,
      appId,
      domain: data.domain || "localhost:3000",
      widgetConfigJson: JSON.stringify({
        colors: {
          background: "#6366f1",
          action: "#4f46e5",
        },
        position: "bottom-right",
        welcomeMessage: "¡Hola! ¿En qué podemos ayudarte?",
      }),
    });

    console.log(`[onboarding] Site created for account ${accountId}:`, {
      siteId,
      appId,
      name: `${accountName} - Sitio Principal`,
    });
  }

  return NextResponse.json({ ok: true });
}
