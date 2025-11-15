"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

function readKunoroUserCookie(): any {
  if (typeof document === "undefined") return {};
  const match = document.cookie.split(";").find((c) => c.trim().startsWith("kunoro_user="));
  if (!match) return {};
  try {
    const raw = decodeURIComponent(match.split("=")[1] ?? "");
    return JSON.parse(raw ?? "{}");
  } catch {
    return {};
  }
}

export default function OnboardingAiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [useAi, setUseAi] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = readKunoroUserCookie();
    if (typeof data.useAi === "boolean") setUseAi(data.useAi);
    setLoading(false);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError(null);

    if (typeof document !== "undefined") {
      const existing = readKunoroUserCookie();
      const payload = encodeURIComponent(
        JSON.stringify({
          ...existing,
          useAi,
        }),
      );
      document.cookie = `kunoro_user=${payload}; path=/; max-age=31536000`;
    }

    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
      });

      if (!res.ok) {
        setError("No se pudo guardar la información del tour. Intenta de nuevo.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Hubo un error de conexión al guardar el tour.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-xs text-slate-400">Cargando tour...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[1.3fr_minmax(0,1fr)] gap-8">
        {/* Panel de preferencia de IA */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl px-8 py-8 flex flex-col gap-8 shadow-lg">
          <header className="flex items-center justify-between">
            <div>
              <p className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] mb-2">
                ⚡ Automatiza hasta el 50% de las consultas repetitivas
              </p>
              <h1 className="text-lg font-semibold tracking-tight">
                ¿Quieres que la IA de Kunoro resuelva las preguntas repetitivas?
              </h1>
            </div>
          </header>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3 text-xs">
              <button
                type="button"
                onClick={() => setUseAi(true)}
                className={`flex-1 rounded-xl border px-4 py-3 text-left transition-colors ${
                  useAi === true
                    ? "border-blue-500 bg-blue-500/10 text-slate-50"
                    : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                Sí, automatícelas
              </button>
              <button
                type="button"
                onClick={() => setUseAi(false)}
                className={`flex-1 rounded-xl border px-4 py-3 text-left transition-colors ${
                  useAi === false
                    ? "border-blue-500 bg-blue-500/10 text-slate-50"
                    : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                No, las manejaré manualmente
              </button>
            </div>

            {error && (
              <p className="text-[11px] text-red-400 bg-red-950/40 border border-red-900 rounded-md px-2 py-1">
                {error}
              </p>
            )}

            <div className="flex justify-between items-center pt-2">
              <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden mr-4">
                <div className="h-full w-full bg-blue-500" />
              </div>
              <button
                type="submit"
                disabled={useAi === null}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-slate-50 shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Finalizar
              </button>
            </div>
          </form>
        </section>

        {/* Panel visual */}
        <section className="hidden md:flex items-center justify-center">
          <div className="relative w-72 h-[420px] rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
            <div className="w-44 h-28 rounded-2xl bg-slate-800 mb-4" />
            <div className="absolute bottom-8 right-8 w-20 h-14 rounded-xl bg-slate-900 border border-slate-700" />
          </div>
        </section>
      </div>
    </main>
  );
}
