"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const VISITOR_RANGES = [
  "Hasta 1 000",
  "1 000 - 9 999",
  "10 000 - 49 999",
  "50 000 - 99 999",
  "100 000 o más",
  "No sé",
];

const PLATFORMS = [
  "WordPress",
  "Sitio web personalizado",
  "PrestaShop",
  "Shopify",
  "Flujo web",
  "WooCommerce",
  "BigCommerce",
  "Otros",
];

const AGENT_COUNTS = [
  "Solo yo",
  "2 - 5",
  "6 - 19",
  "20 o más",
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

export default function OnboardingWebsitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [visitorsRange, setVisitorsRange] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [agentCount, setAgentCount] = useState<string | null>(null);

  useEffect(() => {
    const data = readKunoroUserCookie();
    // Podríamos precargar más adelante
    setLoading(false);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (typeof document !== "undefined") {
      const existing = readKunoroUserCookie();
      const payload = encodeURIComponent(
        JSON.stringify({
          ...existing,
          visitorsRange,
          platform,
          agentCount,
        }),
      );
      document.cookie = `kunoro_user=${payload}; path=/; max-age=31536000`;
    }

    router.push("/onboarding/ai");
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
              <h1 className="text-lg font-semibold tracking-tight">Últimos detalles</h1>
              <p className="text-xs text-slate-400 mt-1">
                Con esto podremos dimensionar mejor tu uso del chat.
              </p>
            </div>
          </header>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <h2 className="text-sm font-medium">¿Cuántos visitantes atrae al mes tu sitio web?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {VISITOR_RANGES.map((range) => (
                  <button
                    type="button"
                    key={range}
                    onClick={() => setVisitorsRange(range)}
                    className={`border rounded-lg px-3 py-2 text-left transition-colors ${
                      visitorsRange === range
                        ? "border-blue-500 bg-blue-500/10 text-slate-50"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-medium">¿Qué plataforma impulsa tu sitio web?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {PLATFORMS.map((plt) => (
                  <button
                    type="button"
                    key={plt}
                    onClick={() => setPlatform(plt)}
                    className={`border rounded-lg px-3 py-2 text-left transition-colors ${
                      platform === plt
                        ? "border-blue-500 bg-blue-500/10 text-slate-50"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {plt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-medium">
                ¿Cuántos agentes de atención al cliente tienes en tu configuración actual?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {AGENT_COUNTS.map((count) => (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setAgentCount(count)}
                    className={`border rounded-lg px-3 py-2 text-left transition-colors ${
                      agentCount === count
                        ? "border-blue-500 bg-blue-500/10 text-slate-50"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden mr-4">
                <div className="h-full w-full bg-blue-500" />
              </div>
              <button
                type="submit"
                disabled={!visitorsRange || !platform || !agentCount}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-slate-50 shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </form>
        </section>

        {/* Panel visual */}
        <section className="hidden md:flex items-center justify-center">
          <div className="relative w-72 h-[420px] rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
            <div className="w-40 h-28 rounded-2xl bg-slate-800 mb-4" />
            <div className="absolute bottom-6 right-6 w-20 h-14 rounded-xl bg-slate-900 border border-slate-700" />
          </div>
        </section>
      </div>
    </main>
  );
}
