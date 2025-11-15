import { NextRequest } from "next/server";
import { db } from "@/db";
import { apiTokens, accounts, user } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { corsHeaders } from "./cors";

export interface AuthContext {
  token: {
    id: string;
    name: string;
    accountId: string;
    userId: string;
    scopes: string[];
  };
  account: {
    id: string;
    name: string;
    plan: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Extrae el token Bearer del header Authorization
 */
export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader) {
    return null;
  }

  // Formato esperado: "Bearer <token>"
  const parts = authHeader.split(" ");
  
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Valida un token Bearer y retorna el contexto de autenticación
 */
export async function validateBearerToken(
  token: string
): Promise<{ success: true; context: AuthContext } | { success: false; error: string }> {
  try {
    // Buscar el token en la base de datos con joins
    const result = await db
      .select({
        token: apiTokens,
        account: accounts,
        user: user,
      })
      .from(apiTokens)
      .innerJoin(accounts, eq(apiTokens.accountId, accounts.id))
      .innerJoin(user, eq(apiTokens.userId, user.id))
      .where(
        and(
          eq(apiTokens.token, token),
          eq(apiTokens.isActive, true)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "Token inválido o inactivo" };
    }

    const { token: tokenData, account, user: userData } = result[0];

    // Verificar expiración
    if (tokenData.expiresAt && tokenData.expiresAt < new Date()) {
      return { success: false, error: "Token expirado" };
    }

    // Actualizar última vez usado (sin await para no bloquear)
    db.update(apiTokens)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiTokens.id, tokenData.id))
      .then()
      .catch((err) => console.error("Error actualizando lastUsedAt:", err));

    // Parsear scopes
    let scopes: string[] = [];
    if (tokenData.scopes) {
      try {
        scopes = JSON.parse(tokenData.scopes);
      } catch (e) {
        console.error("Error parsing scopes:", e);
      }
    }

    return {
      success: true,
      context: {
        token: {
          id: tokenData.id,
          name: tokenData.name,
          accountId: tokenData.accountId,
          userId: tokenData.userId,
          scopes,
        },
        account: {
          id: account.id,
          name: account.name,
          plan: account.plan,
        },
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        },
      },
    };
  } catch (error) {
    console.error("Error validando token Bearer:", error);
    return { success: false, error: "Error interno al validar token" };
  }
}

/**
 * Middleware helper para proteger rutas con Bearer token
 */
export async function requireBearerAuth(
  request: NextRequest
): Promise<
  | { authenticated: true; context: AuthContext }
  | { authenticated: false; response: Response }
> {
  const token = extractBearerToken(request);

  if (!token) {
    return {
      authenticated: false,
      response: new Response(
        JSON.stringify({
          error: "No autorizado",
          message: "Se requiere token Bearer en el header Authorization",
        }),
        {
          status: 401,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders()
          },
        }
      ),
    };
  }

  const validation = await validateBearerToken(token);

  if (!validation.success) {
    return {
      authenticated: false,
      response: new Response(
        JSON.stringify({
          error: "No autorizado",
          message: validation.error,
        }),
        {
          status: 401,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders()
          },
        }
      ),
    };
  }

  return {
    authenticated: true,
    context: validation.context,
  };
}

/**
 * Verifica si el token tiene un scope específico
 */
export function hasScope(context: AuthContext, scope: string): boolean {
  return context.token.scopes.includes(scope) || context.token.scopes.includes("*");
}

