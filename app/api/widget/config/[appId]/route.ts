import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { eq } from "drizzle-orm";
import { parseWidgetConfig } from "@/lib/widget-config";

export async function GET(
  _request: NextRequest,
  { params }: { params: { appId: string } },
) {
  try {
    const appId = params.appId;

    if (!appId) {
      return NextResponse.json({ error: "Falta el appId" }, { status: 400 });
    }

    const [site] = await db.select().from(sites).where(eq(sites.appId, appId)).limit(1);

    if (!site) {
      return NextResponse.json(
        {
          appId,
          config: parseWidgetConfig(null),
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      appId,
      site: {
        id: site.id,
        name: site.name,
        domain: site.domain,
      },
      config: parseWidgetConfig(site.widgetConfigJson),
    });
  } catch (error) {
    console.error("[widget-config:get]", error);
    return NextResponse.json(
      { error: "No pudimos cargar la configuración del widget" },
      { status: 500 },
    );
  }
}

