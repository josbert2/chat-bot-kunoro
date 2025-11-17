import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_WIDGET_COLORS,
  WidgetColors,
  normalizeHexColor,
} from "@/lib/widget-config";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 [WIDGET CONFIG] Iniciando actualización de configuración');

    // Obtener token del localStorage (se envía en el header Authorization)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ [WIDGET CONFIG] No hay token de autenticación');
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { siteId, colors } = (await request.json()) as {
      siteId?: string;
      colors?: Partial<WidgetColors>;
    };

    console.log('🔵 [WIDGET CONFIG] Datos recibidos:', { siteId, colors });

    if (!siteId) {
      return NextResponse.json({ error: "Falta el sitio a actualizar" }, { status: 400 });
    }

    const normalizedColors: WidgetColors = {
      background: normalizeHexColor(colors?.background, DEFAULT_WIDGET_COLORS.background),
      action: normalizeHexColor(colors?.action, DEFAULT_WIDGET_COLORS.action),
    };

    console.log('🔵 [WIDGET CONFIG] Colores normalizados:', normalizedColors);

    // Llamar al API Express - endpoint correcto: /v1/projects/:projectId/widget
    const response = await fetch(`${API_URL}/v1/projects/${siteId}/widget`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        colors: normalizedColors,
      }),
    });

    console.log('🔵 [WIDGET CONFIG] Response del API:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ [WIDGET CONFIG] Error del API:', error);
      return NextResponse.json(
        { error: error.message || "No pudimos guardar los cambios" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ [WIDGET CONFIG] Configuración guardada exitosamente');

    return NextResponse.json({
      ok: true,
      config: { colors: normalizedColors },
    });
  } catch (error) {
    console.error("❌ [WIDGET CONFIG] Error:", error);
    return NextResponse.json(
      { error: "No pudimos guardar los cambios. Intenta de nuevo." },
      { status: 500 },
    );
  }
}

