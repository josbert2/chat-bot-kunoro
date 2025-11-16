import { NextRequest, NextResponse } from "next/server";
import { requireBearerAuth } from "@/lib/bearer-auth";
import { handleCorsOptions, withCors } from "@/lib/cors";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * OPTIONS /api/v1/sites
 * Maneja preflight CORS
 */
export async function OPTIONS() {
  return handleCorsOptions();
}

/**
 * GET /api/v1/sites
 * Lista todos los sitios de la cuenta autenticada
 * Requiere autenticación Bearer
 * 
 * Ejemplo de uso:
 * curl -H "Authorization: Bearer kunoro_xxxxx" http://localhost:3000/api/v1/sites
 */
export async function GET(request: NextRequest) {
  // Validar autenticación Bearer
  const authResult = await requireBearerAuth(request);

  if (!authResult.authenticated) {
    return withCors(authResult.response);
  }

  const { context } = authResult;

  try {
    // Obtener todos los sitios de la cuenta
    const accountSites = await db
      .select({
        id: sites.id,
        name: sites.name,
        appId: sites.appId,
        domain: sites.domain,
        widgetConfigJson: sites.widgetConfigJson,
        createdAt: sites.createdAt,
      })
      .from(sites)
      .where(eq(sites.accountId, context.account.id));

    // Procesar configuración del widget
    const processedSites = accountSites.map((site) => {
      let widgetConfig = null;
      if (site.widgetConfigJson) {
        try {
          widgetConfig = JSON.parse(site.widgetConfigJson);
        } catch (e) {
          console.error("Error parsing widget config:", e);
        }
      }

      return {
        id: site.id,
        name: site.name,
        appId: site.appId,
        domain: site.domain,
        widgetConfig,
        createdAt: site.createdAt.toISOString(),
        widgetSnippet: `<script src="${process.env.NEXT_PUBLIC_WIDGET_URL || 'https://cdn.kunoro.com/widget.js'}" data-app-id="${site.appId}"></script>`,
      };
    });

    return withCors(NextResponse.json({
      success: true,
      data: processedSites,
      total: processedSites.length,
    }));
  } catch (error) {
    console.error("Error obteniendo sitios:", error);
    return withCors(NextResponse.json(
      { error: "Error interno", message: "No se pudieron obtener los sitios" },
      { status: 500 }
    ));
  }
}

