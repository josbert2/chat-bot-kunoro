"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const BUSINESS_MODELS = [
  "Presto servicios (a empresas o consumidores)",
  "Comercio electrónico (tienda en línea)",
  "Otros",
];

const CONVERSATION_RANGES = [
  "Hasta 200",
  "200 - 999",
  "1000 - 4 999",
  "5 000 - 9 999",
  "10 000 o más",
  "No sé",
];

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

export default function OnboardingBusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [businessModel, setBusinessModel] = useState<string | null>(null);
  const [industry, setIndustry] = useState("");
  const [conversationsRange, setConversationsRange] = useState<string | null>(null);

  useEffect(() => {
    const data = readKunoroUserCookie();
    // Podríamos precargar valores si más adelante los guardamos
    setLoading(false);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (typeof document !== "undefined") {
      const existing = readKunoroUserCookie();
      const payload = encodeURIComponent(
        JSON.stringify({
          ...existing,
          businessModel,
          industry,
          conversationsRange,
        }),
      );
      document.cookie = `kunoro_user=${payload}; path=/; max-age=31536000`;
    }

    router.push("/onboarding/goals");
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
        {/* Panel de preguntas */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl px-8 py-8 flex flex-col gap-8 shadow-lg">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Cuéntanos sobre tu negocio</h1>
              <p className="text-xs text-slate-400 mt-1">
                Esto nos ayuda a adaptar las recomendaciones y el setup del chat.
              </p>
            </div>
          </header>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <h2 className="text-sm font-medium">¿Cuál es tu modelo de negocio principal?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {BUSINESS_MODELS.map((model) => (
                  <button
                    type="button"
                    key={model}
                    onClick={() => setBusinessModel(model)}
                    className={`border rounded-lg px-3 py-2 text-left transition-colors ${
                      businessModel === model
                        ? "border-blue-500 bg-blue-500/10 text-slate-50"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-medium">¿Cuál es la industria de tu compañía?</h2>
              <select
                className="mt-2 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option value="Accesorios para fumar y vapear">Accesorios para fumar y vapear</option>
                <option value="E-commerce">E-commerce</option>
                <option value="SaaS">SaaS</option>
                <option value="Servicios profesionales">Servicios profesionales</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-medium">
                ¿Cuántas conversaciones con clientes manejas al mes?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {CONVERSATION_RANGES.map((range) => (
                  <button
                    type="button"
                    key={range}
                    onClick={() => setConversationsRange(range)}
                    className={`border rounded-lg px-3 py-2 text-left transition-colors ${
                      conversationsRange === range
                        ? "border-blue-500 bg-blue-500/10 text-slate-50"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden mr-4">
                <div className="h-full w-5/6 bg-blue-500" />
              </div>
              <button
                type="submit"
                disabled={!businessModel || !industry || !conversationsRange}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-slate-50 shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </form>
        </section>

        {/* Panel visual */}
        <section className="hidden md:flex items-center justify-center">
          <div className="relative w-72 h-[420px] rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-[13px]">
                🛒
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-[13px]">
                🏷️
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-[13px]">
                💬
              </div>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-40 h-40 rounded-2xl bg-slate-800" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
