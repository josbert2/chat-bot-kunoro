"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GenerateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GenerateTokenModal({ isOpen, onClose }: GenerateTokenModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState<string>("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["*"]);

  const availableScopes = [
    { value: "*", label: "Acceso completo", description: "Todos los permisos" },
    { value: "chat:read", label: "Chat: Lectura", description: "Leer conversaciones" },
    { value: "chat:write", label: "Chat: Escritura", description: "Enviar mensajes" },
    { value: "sites:read", label: "Sitios: Lectura", description: "Listar sitios" },
    { value: "sites:write", label: "Sitios: Escritura", description: "Crear/editar sitios" },
    { value: "account:read", label: "Cuenta: Lectura", description: "Info de cuenta" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tokens/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          scopes: selectedScopes,
          expiresInDays: expiresInDays ? parseInt(expiresInDays) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al generar token");
      }

      setGeneratedToken(data.data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (generatedToken) {
      await navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    if (generatedToken) {
      router.refresh();
    }
    onClose();
  };

  const toggleScope = (scope: string) => {
    if (scope === "*") {
      setSelectedScopes(["*"]);
    } else {
      const filtered = selectedScopes.filter((s) => s !== "*");
      if (selectedScopes.includes(scope)) {
        const newScopes = filtered.filter((s) => s !== scope);
        setSelectedScopes(newScopes.length > 0 ? newScopes : ["*"]);
      } else {
        setSelectedScopes([...filtered, scope]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {generatedToken ? "✅ Token Generado" : "Generar Nuevo Token"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {generatedToken
                ? "Copia tu token ahora, no podrás verlo de nuevo"
                : "Crea un token Bearer para autenticar requests a la API"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {generatedToken ? (
          // Token generado - mostrar una sola vez
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4">
              <p className="mb-2 text-sm font-semibold text-emerald-900">
                ⚠️ Importante: Guarda este token en un lugar seguro
              </p>
              <p className="text-xs text-emerald-700">
                Por razones de seguridad, el token completo solo se muestra una vez.
                No podrás verlo de nuevo después de cerrar esta ventana.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tu Token Bearer
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedToken}
                  readOnly
                  className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900"
                />
                <button
                  onClick={handleCopy}
                  className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  {copied ? "✓ Copiado" : "📋 Copiar"}
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="mb-2 text-sm font-semibold text-blue-900">
                Próximos pasos
              </p>
              <ul className="space-y-1 text-xs text-blue-700">
                <li>• Guarda el token en variables de entorno de tu aplicación</li>
                <li>• Nunca lo expongas en código frontend o repositorios públicos</li>
                <li>• Usa el header: <code className="rounded bg-blue-100 px-1 py-0.5">Authorization: Bearer tu_token</code></li>
                <li>• Prueba con la interfaz de test: <a href="/test-api.html" className="underline" target="_blank">test-api.html</a></li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Entendido, cerrar
              </button>
            </div>
          </div>
        ) : (
          // Formulario para generar token
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                Nombre del token <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mi aplicación móvil"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <p className="mt-1 text-xs text-slate-500">
                Un nombre descriptivo para identificar dónde usas este token
              </p>
            </div>

            {/* Scopes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Permisos (Scopes)
              </label>
              <div className="space-y-2">
                {availableScopes.map((scope) => (
                  <label
                    key={scope.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                      selectedScopes.includes(scope.value)
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(scope.value)}
                      onChange={() => toggleScope(scope.value)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{scope.label}</p>
                      <p className="text-xs text-slate-500">{scope.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Expiración */}
            <div>
              <label htmlFor="expires" className="mb-2 block text-sm font-medium text-slate-700">
                Expira en (días) <span className="text-slate-400">(opcional)</span>
              </label>
              <input
                type="number"
                id="expires"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                placeholder="30, 90, 365..."
                min="1"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <p className="mt-1 text-xs text-slate-500">
                Deja vacío para que el token no expire nunca
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">❌ {error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Generando..." : "Generar Token"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

