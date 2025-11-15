import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { apiTokens } from "@/db/schema";
import { randomBytes } from "crypto";
import { ensureUserHasAccount } from "@/lib/ensure-account";

/**
 * POST /api/tokens/generate
 * Genera un nuevo token Bearer para la API
 * Requiere autenticación con Better Auth (sesión de usuario)
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación con Better Auth
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json(
        { error: "No autenticado", message: "Debes iniciar sesión para generar tokens" },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;

    // Asegurar que el usuario tenga una cuenta (crear si no existe)
    let accountId: string;
    try {
      accountId = await ensureUserHasAccount(userId);
    } catch (error) {
      return NextResponse.json(
        {
          error: "Error de cuenta",
          message: "No se pudo crear o verificar tu cuenta. Por favor, intenta de nuevo.",
        },
        { status: 500 }
      );
    }

    // Obtener datos del body
    const body = await request.json();
    const { name, scopes, expiresInDays } = body;

    // Validaciones
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Nombre requerido", message: "Debes proporcionar un nombre para el token" },
        { status: 400 }
      );
    }

    // Generar token único y seguro (64 caracteres hex)
    const token = `kunoro_${randomBytes(32).toString("hex")}`;

    // Calcular fecha de expiración si se proporcionó
    let expiresAt: Date | null = null;
    if (expiresInDays && typeof expiresInDays === "number" && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Procesar scopes
    const scopesArray = Array.isArray(scopes) ? scopes : ["*"];
    const scopesJson = JSON.stringify(scopesArray);

    // Generar ID único
    const tokenId = `tok_${randomBytes(16).toString("hex")}`;

    // Guardar en la base de datos
    await db.insert(apiTokens).values({
      id: tokenId,
      name: name.trim(),
      token,
      accountId: accountId,
      userId: userId,
      scopes: scopesJson,
      expiresAt,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Token creado exitosamente",
        data: {
          id: tokenId,
          name: name.trim(),
          token, // ⚠️ Este es el único momento en que se muestra el token completo
          scopes: scopesArray,
          expiresAt: expiresAt?.toISOString() || null,
          createdAt: new Date().toISOString(),
        },
        warning:
          "⚠️ Guarda este token en un lugar seguro. No podrás verlo de nuevo por razones de seguridad.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generando token:", error);
    return NextResponse.json(
      { error: "Error interno", message: "No se pudo generar el token" },
      { status: 500 }
    );
  }
}

