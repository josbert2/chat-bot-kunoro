"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiToken } from "@/db/schema";

interface TokensListProps {
  initialTokens: ApiToken[];
}

export function TokensList({ initialTokens }: TokensListProps) {
  const router = useRouter();
  const [tokens, setTokens] = useState(initialTokens);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleRevoke = async (tokenId: string, tokenName: string) => {
    if (!confirm(`¿Estás seguro de que deseas revocar el token "${tokenName}"?\n\nEsta acción no se puede deshacer y todas las aplicaciones que usen este token dejarán de funcionar.`)) {
      return;
    }

    setRevokingId(tokenId);

    try {
      const response = await fetch("/api/tokens/revoke", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al revocar token");
      }

      // Actualizar la lista localmente
      setTokens((prev) =>
        prev.map((t) =>
          t.id === tokenId ? { ...t, isActive: false } : t
        )
      );

      // Refrescar la página para obtener datos actualizados
      router.refresh();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setRevokingId(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Nunca";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTokenPreview = (token: string) => {
    return `${token.substring(0, 15)}...${token.substring(token.length - 8)}`;
  };

  const isExpired = (token: ApiToken) => {
    return token.expiresAt && new Date(token.expiresAt) < new Date();
  };

  if (tokens.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <span className="text-3xl">🔑</span>
        </div>
        <h4 className="mb-2 text-lg font-semibold text-slate-900">
          No tienes tokens API todavía
        </h4>
        <p className="mb-6 text-sm text-slate-500">
          Genera tu primer token para empezar a usar la API desde aplicaciones externas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">
          Tus Tokens ({tokens.length})
        </h4>
      </div>

      <div className="space-y-3">
        {tokens.map((token) => {
          const expired = isExpired(token);
          const inactive = !token.isActive;

          let scopes: string[] = [];
          if (token.scopes) {
            try {
              scopes = JSON.parse(token.scopes);
            } catch (e) {
              scopes = [];
            }
          }

          return (
            <div
              key={token.id}
              className={`rounded-xl border bg-white p-4 shadow-sm transition-all ${
                inactive || expired
                  ? "border-slate-200 opacity-60"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Info principal */}
                <div className="flex-1 space-y-3">
                  {/* Nombre y estado */}
                  <div className="flex items-center gap-3">
                    <h5 className="text-base font-semibold text-slate-900">
                      {token.name}
                    </h5>
                    <div className="flex gap-2">
                      {inactive ? (
                        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                          ❌ REVOCADO
                        </span>
                      ) : expired ? (
                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          ⏰ EXPIRADO
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          ✓ ACTIVO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Token preview */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Token (preview)
                    </p>
                    <code className="text-xs font-mono text-slate-700">
                      {getTokenPreview(token.token)}
                    </code>
                  </div>

                  {/* Scopes */}
                  <div>
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Permisos
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scopes.map((scope) => (
                        <span
                          key={scope}
                          className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700"
                        >
                          {scope === "*" ? "🔓 Acceso completo" : scope}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <p className="text-slate-500">Creado</p>
                      <p className="font-medium text-slate-900">
                        {formatDate(token.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Último uso</p>
                      <p className="font-medium text-slate-900">
                        {token.lastUsedAt ? formatDate(token.lastUsedAt) : "Nunca"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Expira</p>
                      <p
                        className={`font-medium ${
                          expired ? "text-red-600" : "text-slate-900"
                        }`}
                      >
                        {token.expiresAt ? formatDate(token.expiresAt) : "Nunca"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">ID</p>
                      <p className="font-mono text-[10px] text-slate-700">
                        {token.id.substring(0, 12)}...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2">
                  {token.isActive && !expired && (
                    <button
                      onClick={() => handleRevoke(token.id, token.name)}
                      disabled={revokingId === token.id}
                      className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      {revokingId === token.id ? "Revocando..." : "🗑️ Revocar"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

