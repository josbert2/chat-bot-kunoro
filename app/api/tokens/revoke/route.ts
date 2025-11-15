import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { apiTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ensureUserHasAccount } from "@/lib/ensure-account";

/**
 * DELETE /api/tokens/revoke
 * Revoca (desactiva) un token API
 * Requiere autenticación con Better Auth
 */
export async function DELETE(request: NextRequest) {
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

    // Obtener ID del token a revocar
    const body = await request.json();
    const { tokenId } = body;

    if (!tokenId || typeof tokenId !== "string") {
      return NextResponse.json(
        { error: "Token ID requerido", message: "Debes proporcionar el ID del token a revocar" },
        { status: 400 }
      );
    }

    // Verificar que el token pertenece a la cuenta del usuario
    const [existingToken] = await db
      .select()
      .from(apiTokens)
      .where(and(eq(apiTokens.id, tokenId), eq(apiTokens.accountId, accountId)))
      .limit(1);

    if (!existingToken) {
      return NextResponse.json(
        { error: "Token no encontrado", message: "El token no existe o no pertenece a tu cuenta" },
        { status: 404 }
      );
    }

    // Desactivar el token (no lo eliminamos para mantener historial)
    await db
      .update(apiTokens)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(apiTokens.id, tokenId));

    return NextResponse.json({
      success: true,
      message: "Token revocado exitosamente",
      data: {
        id: tokenId,
        name: existingToken.name,
      },
    });
  } catch (error) {
    console.error("Error revocando token:", error);
    return NextResponse.json(
      { error: "Error interno", message: "No se pudo revocar el token" },
      { status: 500 }
    );
  }
}

