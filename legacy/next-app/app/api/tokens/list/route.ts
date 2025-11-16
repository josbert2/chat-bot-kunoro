import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { apiTokens } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureUserHasAccount } from "@/lib/ensure-account";

/**
 * GET /api/tokens/list
 * Lista todos los tokens API del usuario autenticado
 * Requiere autenticación con Better Auth
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación con Better Auth
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json(
        { error: "No autenticado", message: "Debes iniciar sesión" },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;

    // Asegurar que el usuario tenga una cuenta
    let accountId: string;
    try {
      accountId = await ensureUserHasAccount(userId);
    } catch (error) {
      return NextResponse.json(
        { error: "Error de cuenta", message: "No se pudo verificar tu cuenta" },
        { status: 500 }
      );
    }

    // Obtener todos los tokens de la cuenta
    const tokens = await db
      .select({
        id: apiTokens.id,
        name: apiTokens.name,
        tokenPreview: apiTokens.token, // Lo vamos a truncar
        lastUsedAt: apiTokens.lastUsedAt,
        expiresAt: apiTokens.expiresAt,
        isActive: apiTokens.isActive,
        scopes: apiTokens.scopes,
        createdAt: apiTokens.createdAt,
      })
      .from(apiTokens)
      .where(eq(apiTokens.accountId, accountId))
      .orderBy(desc(apiTokens.createdAt));

    // Procesar tokens para ocultar el valor completo
    const processedTokens = tokens.map((token) => {
      // Mostrar solo los primeros y últimos caracteres
      const tokenPreview =
        token.tokenPreview.substring(0, 12) +
        "..." +
        token.tokenPreview.substring(token.tokenPreview.length - 8);

      // Parsear scopes
      let scopes: string[] = [];
      if (token.scopes) {
        try {
          scopes = JSON.parse(token.scopes);
        } catch (e) {
          scopes = [];
        }
      }

      return {
        id: token.id,
        name: token.name,
        tokenPreview,
        lastUsedAt: token.lastUsedAt?.toISOString() || null,
        expiresAt: token.expiresAt?.toISOString() || null,
        isActive: token.isActive,
        isExpired: token.expiresAt ? token.expiresAt < new Date() : false,
        scopes,
        createdAt: token.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: processedTokens,
      total: processedTokens.length,
    });
  } catch (error) {
    console.error("Error listando tokens:", error);
    return NextResponse.json(
      { error: "Error interno", message: "No se pudieron obtener los tokens" },
      { status: 500 }
    );
  }
}

