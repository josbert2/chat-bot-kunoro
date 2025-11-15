import { NextRequest, NextResponse } from "next/server";
import { requireBearerAuth } from "@/lib/bearer-auth";
import { handleCorsOptions, withCors } from "@/lib/cors";

/**
 * OPTIONS /api/v1/account
 * Maneja preflight CORS
 */
export async function OPTIONS() {
  return handleCorsOptions();
}

/**
 * GET /api/v1/account
 * Obtiene información de la cuenta autenticada
 * Requiere autenticación Bearer
 * 
 * Ejemplo de uso:
 * curl -H "Authorization: Bearer kunoro_xxxxx" http://localhost:3000/api/v1/account
 */
export async function GET(request: NextRequest) {
  // Validar autenticación Bearer
  const authResult = await requireBearerAuth(request);

  if (!authResult.authenticated) {
    return withCors(authResult.response);
  }

  const { context } = authResult;

  // Retornar información de la cuenta
  return withCors(NextResponse.json({
    success: true,
    data: {
      account: {
        id: context.account.id,
        name: context.account.name,
        plan: context.account.plan,
      },
      user: {
        id: context.user.id,
        name: context.user.name,
        email: context.user.email,
      },
      token: {
        name: context.token.name,
        scopes: context.token.scopes,
      },
    },
  }));
}

