import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { sites, user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import {
  DEFAULT_WIDGET_COLORS,
  WidgetColors,
  normalizeHexColor,
  serializeWidgetConfig,
} from "@/lib/widget-config";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId, colors } = (await request.json()) as {
      siteId?: string;
      colors?: Partial<WidgetColors>;
    };

    if (!siteId) {
      return NextResponse.json({ error: "Falta el sitio a actualizar" }, { status: 400 });
    }

    const userId = session.user.id as string;
    const [currentUser] = await db.select().from(user).where(eq(user.id, userId));

    if (!currentUser?.accountId) {
      return NextResponse.json(
        { error: "Tu usuario aún no está vinculado a una cuenta" },
        { status: 400 },
      );
    }

    const [site] = await db
      .select()
      .from(sites)
      .where(and(eq(sites.id, siteId), eq(sites.accountId, currentUser.accountId)));

    if (!site) {
      return NextResponse.json({ error: "Sitio no encontrado" }, { status: 404 });
    }

    const normalizedColors: WidgetColors = {
      background: normalizeHexColor(colors?.background, DEFAULT_WIDGET_COLORS.background),
      action: normalizeHexColor(colors?.action, DEFAULT_WIDGET_COLORS.action),
    };

    await db
      .update(sites)
      .set({
        widgetConfigJson: serializeWidgetConfig({ colors: normalizedColors }),
      })
      .where(eq(sites.id, site.id));

    return NextResponse.json({
      ok: true,
      config: { colors: normalizedColors },
    });
  } catch (error) {
    console.error("[widget-config] Error updating widget config", error);
    return NextResponse.json(
      { error: "No pudimos guardar los cambios. Intenta de nuevo." },
      { status: 500 },
    );
  }
}

