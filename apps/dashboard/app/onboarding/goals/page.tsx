"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const GOALS = [
  {
    id: "leads",
    title: "Generar prospectos",
    description:
      "Capta prospectos de calidad con mensajes automáticos que atraen al público correcto.",
  },
  {
    id: "ai_support",
    title: "Automatizar asistencia con IA",
    description:
      "Ahorra tiempo a tu equipo dejando que la IA responda preguntas frecuentes.",
  },
  {
    id: "live_support",
    title: "Ofrecer asistencia en vivo",
    description:
      "Mejora la satisfacción con chat en vivo, videollamadas y comunicación multicanal.",
  },
  {
    id: "sales",
    title: "Aumentar las ventas",
    description:
      "Impulsa tus ventas con mensajes proactivos y flujos automatizados.",
  },
  {
    id: "tickets",
    title: "Configurar sistema de tickets",
    description:
      "Convierte mensajes en tickets ordenados y optimiza el flujo de soporte.",
  },
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

export default function OnboardingGoalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [goalId, setGoalId] = useState<string | null>(null);

  useEffect(() => {
    const data = readKunoroUserCookie();
    if (data?.goalId) setGoalId(data.goalId);
    setLoading(false);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (typeof document !== "undefined") {
      const existing = readKunoroUserCookie();
      const payload = encodeURIComponent(
        JSON.stringify({
          ...existing,
          goalId,
        }),
      );
      document.cookie = `kunoro_user=${payload}; path=/; max-age=31536000`;
    }

    router.push("/onboarding/website");
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
        {/* Panel de objetivos */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl px-8 py-8 flex flex-col gap-8 shadow-lg">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Mi principal objetivo al utilizar Kunoro es...
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Esto nos ayuda a enfocarnos en lo que más importa para tu negocio.
              </p>
            </div>
          </header>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoalId(g.id)}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-colors ${
                    goalId === g.id
                      ? "border-blue-500 bg-blue-500/10 text-slate-50"
                      : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <span className="text-xs font-semibold">{g.title}</span>
                  <span className="text-[11px] text-slate-400">{g.description}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden mr-4">
                <div className="h-full w-4/5 bg-blue-500" />
              </div>
              <button
                type="submit"
                disabled={!goalId}
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
            <div className="relative w-40 h-40 rounded-full border border-slate-700 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-600" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
