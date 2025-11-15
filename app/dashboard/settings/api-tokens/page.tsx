import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { apiTokens } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TokensList } from "@/components/TokensList";
import { GenerateTokenButton } from "@/components/GenerateTokenButton";
import { ensureUserHasAccount } from "@/lib/ensure-account";

export default async function ApiTokensPage() {
  const session = await auth.api.getSession({ headers: headers() });

  if (!session) {
    return null;
  }

  const userId = session.user.id as string;
  
  // Asegurar que el usuario tenga una cuenta (crear si no existe)
  let accountId: string;
  try {
    accountId = await ensureUserHasAccount(userId);
  } catch (error) {
    return (
      <div className="h-full flex flex-col gap-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            ❌ Error al crear la cuenta. Por favor, contacta con soporte.
          </p>
        </div>
      </div>
    );
  }

  // Obtener todos los tokens del usuario
  const tokens = await db
    .select()
    .from(apiTokens)
    .where(eq(apiTokens.accountId, accountId))
    .orderBy(desc(apiTokens.createdAt));

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Tokens API</h3>
            <p className="text-xs text-slate-500 max-w-2xl">
              Genera tokens Bearer para autenticar requests a la API desde aplicaciones externas.
              Los tokens permiten acceso programático a funciones como chat, sitios y cuentas.
            </p>
          </div>
          <GenerateTokenButton />
        </div>
      </header>

      {/* Info card */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Sobre los tokens Bearer
            </h4>
            <p className="text-xs text-blue-700 mb-2">
              Los tokens Bearer son credenciales que permiten autenticar requests HTTP a tu API sin necesidad 
              de cookies de sesión. Son ideales para integraciones backend-to-backend, aplicaciones móviles y automatizaciones.
            </p>
            <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
              <li>Cada token es único e irrevocable hasta que lo elimines</li>
              <li>Los tokens nunca expiran a menos que establezcas una fecha</li>
              <li>Puedes controlar permisos con scopes (chat:read, chat:write, etc.)</li>
              <li>El token completo solo se muestra una vez al crearlo</li>
            </ul>
            <div className="mt-3 flex gap-2">
              <a
                href="/test-api.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-100 px-3 py-1 text-[11px] font-medium text-blue-800 hover:bg-blue-200"
              >
                🧪 Probar en interfaz de test
              </a>
              <a
                href="https://github.com/tu-repo/chat-bot-kunoro#api-bearer-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-100 px-3 py-1 text-[11px] font-medium text-blue-800 hover:bg-blue-200"
              >
                📚 Ver documentación
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <span className="text-sm">🔑</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{tokens.length}</p>
              <p className="text-xs text-slate-500">Tokens totales</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <span className="text-sm">✅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {tokens.filter((t) => t.isActive).length}
              </p>
              <p className="text-xs text-slate-500">Activos</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <span className="text-sm">⏰</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {
                  tokens.filter(
                    (t) => t.expiresAt && t.expiresAt < new Date()
                  ).length
                }
              </p>
              <p className="text-xs text-slate-500">Expirados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de tokens */}
      <TokensList initialTokens={tokens} />
    </div>
  );
}

