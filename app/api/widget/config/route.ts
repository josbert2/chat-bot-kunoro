import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { sites, user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import {
  DEFAULT_WIDGET_COLORS,
  WidgetColors,
  WidgetPosition,
  BusinessHours,
  normalizeHexColor,
  serializeWidgetConfig,
  parseWidgetConfig,
} from "@/lib/widget-config";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      siteId?: string;
      colors?: Partial<WidgetColors>;
      messages?: {
        welcomeMessage?: string;
        offlineMessage?: string;
        brandName?: string;
      };
      behavior?: {
        position?: WidgetPosition;
        showPoweredBy?: boolean;
        businessHours?: BusinessHours;
      };
    };

    const { siteId, colors, messages, behavior } = body;

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

    // Parse existing config
    const currentConfig = parseWidgetConfig(site.widgetConfigJson);

    // Merge updates
    const updatedConfig = {
      ...currentConfig,
      ...(colors && {
        colors: {
          background: normalizeHexColor(colors.background, currentConfig.colors.background),
          action: normalizeHexColor(colors.action, currentConfig.colors.action),
        },
      }),
      ...(messages && {
        welcomeMessage: messages.welcomeMessage ?? currentConfig.welcomeMessage,
        offlineMessage: messages.offlineMessage ?? currentConfig.offlineMessage,
        brandName: messages.brandName ?? currentConfig.brandName,
      }),
      ...(behavior && {
        position: behavior.position ?? currentConfig.position,
        showPoweredBy: behavior.showPoweredBy !== undefined ? behavior.showPoweredBy : currentConfig.showPoweredBy,
        businessHours: behavior.businessHours ?? currentConfig.businessHours,
      }),
    };

    await db
      .update(sites)
      .set({
        widgetConfigJson: serializeWidgetConfig(updatedConfig),
      })
      .where(eq(sites.id, site.id));

    return NextResponse.json({
      ok: true,
      config: updatedConfig,
    });
  } catch (error) {
    console.error("[widget-config] Error updating widget config", error);
    return NextResponse.json(
      { error: "No pudimos guardar los cambios. Intenta de nuevo." },
      { status: 500 },
    );
  }
}

